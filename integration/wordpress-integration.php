<?php
/**
 * WordPress AI Chatbot Integration Example
 * 
 * This file shows how to integrate the AI appointment chatbot
 * into a WordPress website using different methods.
 */

// Method 1: Add to functions.php
function add_ai_chatbot_to_footer() {
    // Only load on frontend, not admin
    if (!is_admin()) {
        ?>
        <script src="https://your-chatbot-domain.com/chatbot-embed.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof window.initFloatingChatbot === 'function') {
                    window.initFloatingChatbot({
                        position: 'bottom-right',
                        primaryColor: '<?php echo get_theme_mod('primary_color', '#f3202e'); ?>',
                        serverUrl: 'https://your-chatbot-domain.com'
                    });
                }
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'add_ai_chatbot_to_footer');

// Method 2: WordPress Plugin Approach
function register_ai_chatbot_settings() {
    // Add settings page to admin menu
    add_options_page(
        'AI Chatbot Settings',
        'AI Chatbot',
        'manage_options',
        'ai-chatbot-settings',
        'ai_chatbot_settings_page'
    );
    
    // Register settings
    register_setting('ai_chatbot_settings', 'chatbot_server_url');
    register_setting('ai_chatbot_settings', 'chatbot_primary_color');
    register_setting('ai_chatbot_settings', 'chatbot_position');
    register_setting('ai_chatbot_settings', 'chatbot_enabled');
}
add_action('admin_menu', 'register_ai_chatbot_settings');

function ai_chatbot_settings_page() {
    ?>
    <div class="wrap">
        <h1>AI Chatbot Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('ai_chatbot_settings');
            do_settings_sections('ai_chatbot_settings');
            ?>
            <table class="form-table">
                <tr>
                    <th scope="row">Enable Chatbot</th>
                    <td>
                        <input type="checkbox" name="chatbot_enabled" value="1" 
                               <?php checked(1, get_option('chatbot_enabled', 1)); ?> />
                        <label>Show chatbot on website</label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Server URL</th>
                    <td>
                        <input type="url" name="chatbot_server_url" 
                               value="<?php echo esc_attr(get_option('chatbot_server_url', 'https://your-chatbot-domain.com')); ?>" 
                               class="regular-text" />
                        <p class="description">Your chatbot server URL</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Primary Color</th>
                    <td>
                        <input type="color" name="chatbot_primary_color" 
                               value="<?php echo esc_attr(get_option('chatbot_primary_color', '#f3202e')); ?>" />
                        <p class="description">Chat bubble color</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Position</th>
                    <td>
                        <select name="chatbot_position">
                            <option value="bottom-right" <?php selected(get_option('chatbot_position'), 'bottom-right'); ?>>
                                Bottom Right
                            </option>
                            <option value="bottom-left" <?php selected(get_option('chatbot_position'), 'bottom-left'); ?>>
                                Bottom Left
                            </option>
                        </select>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Enhanced version with admin settings
function add_configurable_ai_chatbot() {
    // Check if chatbot is enabled
    if (!get_option('chatbot_enabled', 1) || is_admin()) {
        return;
    }
    
    $server_url = get_option('chatbot_server_url', 'https://your-chatbot-domain.com');
    $primary_color = get_option('chatbot_primary_color', '#f3202e');
    $position = get_option('chatbot_position', 'bottom-right');
    ?>
    <script src="<?php echo esc_url($server_url); ?>/chatbot-embed.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof window.initFloatingChatbot === 'function') {
                window.initFloatingChatbot({
                    position: '<?php echo esc_js($position); ?>',
                    primaryColor: '<?php echo esc_js($primary_color); ?>',
                    serverUrl: '<?php echo esc_js($server_url); ?>'
                });
            }
        });
    </script>
    <?php
}
add_action('wp_footer', 'add_configurable_ai_chatbot');

// Method 3: Shortcode approach for specific pages
function ai_chatbot_shortcode($atts) {
    $atts = shortcode_atts(array(
        'position' => 'bottom-right',
        'color' => '#f3202e',
        'server' => 'https://your-chatbot-domain.com'
    ), $atts);
    
    static $chatbot_loaded = false;
    
    if (!$chatbot_loaded) {
        $chatbot_loaded = true;
        ob_start();
        ?>
        <script src="<?php echo esc_url($atts['server']); ?>/chatbot-embed.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof window.initFloatingChatbot === 'function') {
                    window.initFloatingChatbot({
                        position: '<?php echo esc_js($atts['position']); ?>',
                        primaryColor: '<?php echo esc_js($atts['color']); ?>',
                        serverUrl: '<?php echo esc_js($atts['server']); ?>'
                    });
                }
            });
        </script>
        <?php
        return ob_get_clean();
    }
    
    return '';
}
add_shortcode('ai_chatbot', 'ai_chatbot_shortcode');

// Method 4: Conditional loading based on page type
function add_conditional_ai_chatbot() {
    // Only show on specific page types
    if (is_admin()) return;
    
    $show_chatbot = false;
    
    // Show on contact page
    if (is_page('contact') || is_page('appointment') || is_page('booking')) {
        $show_chatbot = true;
    }
    
    // Show on healthcare-related posts
    if (is_single() && has_category(array('healthcare', 'medical', 'appointment'))) {
        $show_chatbot = true;
    }
    
    // Show on homepage
    if (is_front_page()) {
        $show_chatbot = true;
    }
    
    if ($show_chatbot) {
        ?>
        <script src="https://your-chatbot-domain.com/chatbot-embed.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof window.initFloatingChatbot === 'function') {
                    window.initFloatingChatbot({
                        position: 'bottom-right',
                        primaryColor: '<?php echo get_theme_mod('primary_color', '#f3202e'); ?>',
                        serverUrl: 'https://your-chatbot-domain.com'
                    });
                }
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'add_conditional_ai_chatbot');

// Usage Examples:

// 1. Add to functions.php (simplest):
// Just add the first method to your theme's functions.php file

// 2. Use shortcode in posts/pages:
// [ai_chatbot]
// [ai_chatbot position="bottom-left" color="#2563eb"]
// [ai_chatbot server="https://your-custom-domain.com"]

// 3. Theme template integration:
// Add this to your theme files (header.php, footer.php, etc.):
/*
<?php
if (function_exists('add_ai_chatbot_to_footer')) {
    add_ai_chatbot_to_footer();
}
?>
*/

// 4. Custom post type integration:
function add_chatbot_to_medical_posts() {
    if (is_singular('medical_service') || is_singular('doctor')) {
        add_ai_chatbot_to_footer();
    }
}
add_action('wp_footer', 'add_chatbot_to_medical_posts');

?>