import JSZip from 'jszip';

/**
 * Applies bionic reading formatting to a text string.
 * Wraps the first half of words in <b> tags.
 * @param {string} text - The text to transform.
 * @returns {string} - HTML string with bold tags.
 */
export function transformText(text) {
    // Regex matches words including unicode characters (Russian, etc.)
    // We use replace with a callback function
    return text.replace(/[\p{L}\p{N}]+/gu, (word) => {
        if (word.length === 1) {
            return `<b>${word}</b>`;
        }
        const splitIndex = Math.ceil(word.length / 2);
        const firstHalf = word.slice(0, splitIndex);
        const secondHalf = word.slice(splitIndex);
        return `<b>${firstHalf}</b>${secondHalf}`;
    });
}

/**
 * Processes a single text node by replacing it with a HTML span containing the transformed text.
 * @param {Node} textNode - The DOM text node.
 * @param {Document} doc - The parent document.
 */
function processTextNode(textNode, doc) {
    const text = textNode.nodeValue;
    if (!text || !text.trim()) return;

    const newHtml = transformText(text);

    // Create a temporary container to parse the new HTML
    const span = doc.createElement('span');
    span.innerHTML = newHtml; // This parses the <b> tags

    // Replace the text node with the new nodes (children of span)
    if (textNode.parentNode) {
        while (span.firstChild) {
            textNode.parentNode.insertBefore(span.firstChild, textNode);
        }
        textNode.parentNode.removeChild(textNode);
    }
}

/**
 * Recursively traverses the DOM to find and process text nodes.
 * Skips script and style tags.
 * @param {Node} node - The DOM node to traverse.
 * @param {Document} doc - The document.
 */
function traverseAndProcess(node, doc) {
    if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node, doc);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip script, style, and already bolded elements (though usually we start with raw text)
        const tagName = node.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'b' || tagName === 'strong') {
            return;
        }

        // Convert childNodes to array to safely iterate while modifying
        const children = Array.from(node.childNodes);
        children.forEach(child => traverseAndProcess(child, doc));
    }
}

/**
 * Main function to process the EPUB file.
 * @param {File} file - The uploaded EPUB file.
 * @returns {Promise<Blob>} - The processed EPUB blob.
 */
export async function processEpub(file) {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    // 1. Find the OPF file path from META-INF/container.xml
    const containerXml = await content.file("META-INF/container.xml")?.async("string");
    if (!containerXml) {
        throw new Error("Invalid EPUB: META-INF/container.xml not found");
    }

    const containerDoc = new DOMParser().parseFromString(containerXml, "application/xml");
    const rootfile = containerDoc.querySelector("rootfile");
    const fullPath = rootfile?.getAttribute("full-path");

    if (!fullPath) {
        throw new Error("Invalid EPUB: OPF path not found");
    }

    // 2. Parse OPF to find content documents (spine/manifest)
    // We actually just need to iterate through all XHTML/HTML files in the zip generally, 
    // but relying on the manifest is safer. 
    // However, for simplicity and robustness against relative paths, iterating all .xhtml/.html might be easier 
    // BUT we must adhere to what's in the manifest to be correct.

    // Let's rely on file extensions which is often robust enough for simple modification
    // or parse the OPF. Let's parse OPF to be better agents.
    const opfContent = await content.file(fullPath)?.async("string");
    if (!opfContent) {
        throw new Error("OPF file missing");
    }

    // Get the directory of the OPF file to resolve relative paths
    const opfDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    const resolvePath = (href) => opfDir ? `${opfDir}/${href}` : href;

    const opfDoc = new DOMParser().parseFromString(opfContent, "application/xml");
    const manifestItems = Array.from(opfDoc.querySelectorAll("manifest item"));

    // Filter for text content types
    const contentItems = manifestItems.filter(item => {
        const mediaType = item.getAttribute("media-type");
        return mediaType === "application/xhtml+xml" || mediaType === "text/html";
    });

    const processedCount = 0;

    for (const item of contentItems) {
        const href = item.getAttribute("href");
        const docPath = resolvePath(href);

        const fileData = content.file(docPath);
        if (!fileData) continue;

        const str = await fileData.async("string");

        // Parse the document
        const doc = new DOMParser().parseFromString(str, "application/xhtml+xml"); // Text/html might be better? XHTML is standard for EPUB 2/3.

        // Check for parse errors
        const parserError = doc.querySelector("parsererror");
        if (parserError) {
            console.warn(`Skipping ${docPath} due to parse error`);
            continue;
        }

        // Process
        traverseAndProcess(doc.body, doc);

        // Serialize back
        const serializer = new XMLSerializer();
        let newStr = serializer.serializeToString(doc);

        // Fix pure XML serialization issues if any (like strict xhtml namespaces) - usually okay.
        // Sometimes self-closing tags on non-void elements break things in browsers, but EPUB readers are XML parsers.

        content.file(docPath, newStr);
    }

    return await content.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
}
