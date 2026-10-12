<?php
/**
 * ChurchTools Calendar Settings Page
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Check user capabilities
if (!current_user_can('manage_options')) {
    return;
}

// Save settings if form submitted
if (isset($_POST['churchtools_calendar_save_settings']) && check_admin_referer('churchtools_calendar_settings_nonce')) {
    update_option('churchtools_calendar_base_url', sanitize_text_field($_POST['churchtools_calendar_base_url']));
    echo '<div class="notice notice-success is-dismissible"><p>' . __('Settings saved successfully.', 'churchtools-calendar') . '</p></div>';
}

$base_url = get_option('churchtools_calendar_base_url', '');
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div class="churchtools-calendar-settings">
        <div class="settings-container">
            <form method="post" action="">
                <?php wp_nonce_field('churchtools_calendar_settings_nonce'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="churchtools_calendar_base_url">
                                <?php _e('ChurchTools API Base URL', 'churchtools-calendar'); ?>
                            </label>
                        </th>
                        <td>
                            <input 
                                type="url" 
                                id="churchtools_calendar_base_url" 
                                name="churchtools_calendar_base_url" 
                                value="<?php echo esc_attr($base_url); ?>" 
                                class="regular-text"
                                placeholder="https://your-church.church.tools"
                                required
                            />
                            <p class="description">
                                <?php _e('Enter the base URL of your ChurchTools instance (e.g., https://your-church.church.tools)', 'churchtools-calendar'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input 
                        type="submit" 
                        name="churchtools_calendar_save_settings" 
                        class="button button-primary" 
                        value="<?php _e('Save Settings', 'churchtools-calendar'); ?>"
                    />
                </p>
            </form>
        </div>
        
        <div class="usage-instructions">
            <h2><?php _e('Usage Instructions', 'churchtools-calendar'); ?></h2>
            
            <div class="card">
                <h3><?php _e('Shortcode', 'churchtools-calendar'); ?></h3>
                <p><?php _e('To display a calendar on your page or post, use the following shortcode:', 'churchtools-calendar'); ?></p>
                <code>[churchtools_calendar id="1"]</code>
                <p class="description">
                    <?php _e('Replace "1" with your calendar ID from ChurchTools.', 'churchtools-calendar'); ?>
                </p>
            </div>
            
            <div class="card">
                <h3><?php _e('Features', 'churchtools-calendar'); ?></h3>
                <ul>
                    <li><?php _e('Interactive month navigation', 'churchtools-calendar'); ?></li>
                    <li><?php _e('Event list for selected day', 'churchtools-calendar'); ?></li>
                    <li><?php _e('Responsive design (mobile and desktop)', 'churchtools-calendar'); ?></li>
                    <li><?php _e('Finnish language support', 'churchtools-calendar'); ?></li>
                    <li><?php _e('Event details with expandable information', 'churchtools-calendar'); ?></li>
                </ul>
            </div>
            
            <div class="card">
                <h3><?php _e('Requirements', 'churchtools-calendar'); ?></h3>
                <ul>
                    <li><?php _e('ChurchTools instance with API access', 'churchtools-calendar'); ?></li>
                    <li><?php _e('Valid calendar ID from ChurchTools', 'churchtools-calendar'); ?></li>
                    <li><?php _e('Internet connection for API requests', 'churchtools-calendar'); ?></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
.churchtools-calendar-settings {
    max-width: 1200px;
}

.settings-container {
    background: #fff;
    padding: 20px;
    margin: 20px 0;
    border: 1px solid #ccd0d4;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
}

.usage-instructions {
    margin-top: 30px;
}

.usage-instructions .card {
    background: #fff;
    padding: 20px;
    margin: 15px 0;
    border: 1px solid #ccd0d4;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
}

.usage-instructions h3 {
    margin-top: 0;
    font-size: 16px;
}

.usage-instructions code {
    display: inline-block;
    background: #f0f0f1;
    padding: 8px 12px;
    margin: 10px 0;
    font-size: 14px;
    border-radius: 3px;
}

.usage-instructions ul {
    list-style-type: disc;
    padding-left: 20px;
}

.usage-instructions ul li {
    margin: 8px 0;
}
</style>
