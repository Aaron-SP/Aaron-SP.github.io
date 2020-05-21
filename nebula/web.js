// Pointer to the rendering context
var last_context_ptr = 0;

// This function is called once after initialization
function context_on_init_js(context_ptr) {
    // Save the frame pointer
    last_context_ptr = context_ptr;

    // Initialize the text editor
    document.getElementById("tool_shader_text").value = Module.get_fragment_source();

    // Trigger window resize
    window.dispatchEvent(new Event('resize'));
}

// This function is called every frame
function context_on_frame_js(context_ptr) {
    // Save the frame pointer
    last_context_ptr = context_ptr;
}

function update_nebula_shader() {
    Module.recompile_program(last_context_ptr, document.getElementById("tool_shader_text").value);
}

function focus_canvas() {
    document.getElementById("tool_render_canvas").focus()
}
