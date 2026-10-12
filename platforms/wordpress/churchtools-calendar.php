<?php
/**
 * Plugin Name: ChurchTools Calendar
 * Plugin URI: https://github.com/Goodboy-Innovations/churchtools-wp-calendar
 * Description: Display ChurchTools calendar events using a shortcode with React and TypeScript
 * Version: 1.1.2
 * Author: Jaakko Ruhanen
 * License: MIT
 * Text Domain: churchtools-calendar
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CHURCHTOOLS_CALENDAR_VERSION', '1.1.2');
define('CHURCHTOOLS_CALENDAR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CHURCHTOOLS_CALENDAR_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main plugin class
 */
class ChurchTools_Calendar {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Initialize plugin
        add_action('plugins_loaded', array($this, 'init'));
        
        // Register admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
        
        // Register shortcode
        add_shortcode('churchtools_calendar', array($this, 'render_calendar_shortcode'));
        
        // Enqueue scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    public function init() {
        // Plugin initialization
        load_plugin_textdomain('churchtools-calendar', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function add_admin_menu() {
        add_options_page(
            __('ChurchTools Calendar Settings', 'churchtools-calendar'),
            __('ChurchTools Calendar', 'churchtools-calendar'),
            'manage_options',
            'churchtools-calendar',
            array($this, 'render_settings_page')
        );
    }
    
    public function register_settings() {
        register_setting('churchtools_calendar_settings', 'churchtools_calendar_base_url', array(
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => ''
        ));
    }
    
    public function render_settings_page() {
        include CHURCHTOOLS_CALENDAR_PLUGIN_DIR . 'admin/settings.php';
    }
    
    public function enqueue_scripts() {
        // Only enqueue if shortcode is present in the content
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'churchtools_calendar')) {
            // Enqueue the compiled JavaScript
            wp_enqueue_script(
                'churchtools-calendar-js',
                CHURCHTOOLS_CALENDAR_PLUGIN_URL . 'dist/churchtools-calendar.iife.js',
                array(),
                CHURCHTOOLS_CALENDAR_VERSION,
                true
            );
            
            // Enqueue the compiled CSS
            wp_enqueue_style(
                'churchtools-calendar-css',
                CHURCHTOOLS_CALENDAR_PLUGIN_URL . 'dist/churchtools-calendar.css',
                array(),
                CHURCHTOOLS_CALENDAR_VERSION
            );
        }
    }
    
    public function render_calendar_shortcode($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(array(
            'id' => '1',
            'view' => 'calendar',
            'lang' => ''
        ), $atts, 'churchtools_calendar');
        
        // Get base URL from settings
        $base_url = get_option('churchtools_calendar_base_url', '');
        
        if (empty($base_url)) {
            return '<div class="churchtools-calendar-error">' . 
                   __('Please configure the ChurchTools API base URL in the plugin settings.', 'churchtools-calendar') . 
                   '</div>';
        }
        
        // Generate unique container ID
        $container_id = 'churchtools-calendar-' . esc_attr($atts['id']);
        
        // Output container div
        $output = '<div id="' . $container_id . '" class="churchtools-calendar-container"></div>';
        
        // Add inline script to initialize the calendar
        $output .= '<script>
            document.addEventListener("DOMContentLoaded", function() {
                if (window.ChurchToolsCalendar && window.ChurchToolsCalendar.init) {
                    window.ChurchToolsCalendar.init(
                        "' . $container_id . '",
                        "' . esc_js($base_url) . '",
                        "' . esc_js($atts['id']) . '",
                        "' . esc_js($atts['view']) . '",
                        "' . esc_js($atts['lang']) . '"
                    );
                }
            });
        </script>';
        
        return $output;
    }
}

// Initialize the plugin
ChurchTools_Calendar::get_instance();
