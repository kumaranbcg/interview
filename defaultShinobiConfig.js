module.exports = {
  defaultConfig: {
    mode: "start",
    mid: "DefaultMonitorID",
    name: "DefaultName",
    type: "h264",
    // Part for connection
    protocol: "",
    host: "",
    port: 80,
    path: "",
    ext: "mp4",
    // FPS
    fps: "1",
    width: "640",
    height: "480",
    shto: "[]",
    shfr: "[]"
  },
  defaultDetail: {
    max_keep_days: "",
    notes: "",
    dir: "",
    rtmp_key: "",
    auto_host_enable: "1",
    auto_host: "",
    rtsp_transport: "tcp",
    muser: "",
    mpass: "",
    port_force: "0",
    fatal_max: "0",
    skip_ping: "1",
    is_onvif: null,
    onvif_port: "",
    primary_input: null,
    aduration: "1000000",
    probesize: "1000000",
    stream_loop: "0",
    sfps: "1",
    accelerator: "0",
    hwaccel: "auto",
    hwaccel_vcodec: "",
    hwaccel_device: "",
    use_coprocessor: null,
    stream_type: "hls",
    stream_flv_type: "http",
    stream_flv_maxLatency: "",
    stream_mjpeg_clients: "",
    stream_vcodec: "copy",
    stream_acodec: "no",
    hls_time: "2",
    hls_list_size: "3",
    preset_stream: "ultrafast",
    signal_check: "10",
    signal_check_log: "0",
    stream_quality: "15",
    stream_fps: "2",
    stream_scale_x: "",
    stream_scale_y: "",
    rotate_stream: "no",
    svf: "",
    tv_channel: "0",
    tv_channel_id: "",
    tv_channel_group_title: "",
    stream_timestamp: "0",
    stream_timestamp_font: "",
    stream_timestamp_font_size: "",
    stream_timestamp_color: "",
    stream_timestamp_box_color: "",
    stream_timestamp_x: "",
    stream_timestamp_y: "",
    stream_watermark: "0",
    stream_watermark_location: "",
    stream_watermark_position: "tr",
    snap: "1",
    snap_fps: "",
    snap_scale_x: "",
    snap_scale_y: "",
    snap_vf: "",
    vcodec: "copy",
    crf: "1",
    preset_record: "",
    acodec: "no",
    dqf: "0",
    cutoff: "15",
    rotate_record: "no",
    vf: "",
    timestamp: "0",
    timestamp_font: "",
    timestamp_font_size: "10",
    timestamp_color: "white",
    timestamp_box_color: "0x00000000@1",
    timestamp_x: "(w-tw)/2",
    timestamp_y: "0",
    watermark: "0",
    watermark_location: "",
    watermark_position: "tr",
    cust_input: "",
    cust_snap: "",
    cust_rtmp: "",
    cust_rawh264: "",
    cust_detect: "",
    cust_stream: "",
    cust_stream_server: "",
    cust_record: "",
    cust_sip_record: "",
    custom_output: "",

    // Enable Send To Plugin
    detector: "1",
    detector_send_frames: "1",
    detector_lock_timeout: "",
    detector_save: "0",

    // Enable Send To Plugin FPS
    detector_fps: "1",
    detector_scale_x: "640",
    detector_scale_y: "480",
    detector_record_method: "sip",
    detector_trigger: "0",
    detector_trigger_record_fps: "",
    detector_timeout: "10",
    detector_send_video_length: "",
    watchdog_reset: "0",
    detector_delete_motionless_videos: "0",
    detector_multi_trigger: null,
    group_detector_multi: "",
    detector_webhook: "0",
    detector_webhook_url: "",
    detector_command_enable: "0",
    detector_command: "",
    detector_command_timeout: "",
    detector_mail: "0",
    detector_mail_send_video: null,
    detector_mail_timeout: "",
    detector_discordbot: null,
    detector_discordbot_send_video: null,
    detector_discordbot_timeout: "",
    use_detector_filters: null,
    use_detector_filters_object: null,
    cords: "[]",
    detector_filters: "",
    detector_pam: "1",
    detector_sensitivity: "",
    detector_max_sensitivity: "",
    detector_threshold: "1",
    detector_color_threshold: "",
    detector_frame: "0",
    detector_noise_filter: null,
    detector_noise_filter_range: "",
    detector_notrigger: "0",
    detector_notrigger_mail: "0",
    detector_notrigger_timeout: "",
    detector_audio: null,
    detector_audio_min_db: "",
    detector_audio_max_db: "",
    detector_use_detect_object: "0",
    detector_send_frames_object: null,
    detector_obj_region: null,
    detector_use_motion: "1",
    detector_fps_object: "",
    detector_scale_x_object: "",
    detector_scale_y_object: "",
    detector_lisence_plate: "0",
    detector_lisence_plate_country: "us",
    detector_buffer_vcodec: "auto",
    detector_buffer_acodec: null,
    detector_buffer_fps: "",
    detector_buffer_hls_time: "",
    detector_buffer_hls_list_size: "",
    detector_buffer_start_number: "",
    detector_buffer_live_start_index: "",
    control: "0",
    control_base_url: "",
    control_url_method: null,
    control_digest_auth: null,
    control_stop: "0",
    control_url_stop_timeout: "",
    control_url_center: "",
    control_url_left: "",
    control_url_left_stop: "",
    control_url_right: "",
    control_url_right_stop: "",
    control_url_up: "",
    control_url_up_stop: "",
    control_url_down: "",
    control_url_down_stop: "",
    control_url_enable_nv: "",
    control_url_disable_nv: "",
    control_url_zoom_out: "",
    control_url_zoom_out_stop: "",
    control_url_zoom_in: "",
    control_url_zoom_in_stop: "",
    groups: "[]",
    loglevel: "warning",
    sqllog: "0",
    detector_cascades: "",
    stream_channels: "",
    input_maps: "",
    input_map_choices: ""
  }
};
