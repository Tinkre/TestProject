/* to use variables from stylesheets, we have to check for variables */
const rootStyles = window.getComputedStyle(document.documentElement); /* get all styles defined in root tag of styles  */
if (rootStyles.getPropertyValue("--book-cover-width-large") != null && rootStyles.getPropertyValue("--book-cover-width-large") !== "") {
    ready()
} else {/* if variables currently not available load them by calling tha main.css file via id */
    document.getElementById("main-css")
        .addEventListener("load", ready);
}

function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue("--book-cover-width-large"));
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue("--book-cover-aspect-ratio"));
    const coverHeight = coverWidth / coverAspectRatio;

    /* define filePond settings */
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    )
    FilePond.setOptions({    
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })
}
FilePond.parse(document.body);