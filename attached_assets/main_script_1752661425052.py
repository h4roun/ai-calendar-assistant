import os
import datetime
from openai import AzureOpenAI
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Azure OpenAI setup #
client = AzureOpenAI(
    api_key="your-api",
    api_version="2025-01-01-preview",
    azure_endpoint="your-endpoint"
)

deployment_name = "gpt-haroun"  # Found in azure openai

# Google Calendar Auth #
SCOPES = ['https://www.googleapis.com/auth/calendar']

def login_to_google():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    else:
        flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
        creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def create_calendar_event(summary, start_time_str, end_time_str):
    creds = login_to_google()
    service = build('calendar', 'v3', credentials=creds)

    event = {
        'summary': summary,
        'start': {
            'dateTime': start_time_str,
            'timeZone': 'Europe/Paris',
        },
        'end': {
            'dateTime': end_time_str,
            'timeZone': 'Europe/Paris',
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    print("Event created:", event.get('htmlLink'))

# Main Logic #

def get_event_from_gpt(user_input):
    system_prompt = (
        "You are an assistant that extracts medical appointment details. "
        "The user will describe a situation, and you must return a JSON object "
        "with the fields: summary, start_time, and end_time in ISO 8601 format."
    )

    response = client.chat.completions.create(
        model=deployment_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ],
        temperature=0.3,
        max_tokens=500
    )

    content = response.choices[0].message.content
    print("GPT Response:", content)
    return eval(content)  # Convert response string to dictionary (careful in production)

# Run the Workflow#

if __name__ == "__main__":
    user_message = input("Describe the appointment: ")

    try:
        event_data = get_event_from_gpt(user_message)
        create_calendar_event(
            summary=event_data['summary'],
            start_time_str=event_data['start_time'],
            end_time_str=event_data['end_time']
        )
    except Exception as e:
        print("Error:", e)
