import css from "css"

// Borrowed from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
export const copyToClipboard = str => {
  const el = document.createElement("textarea") // Create a <textarea> element
  el.value = str // Set its value to the string that you want copied
  el.setAttribute("readonly", "") // Make it readonly to be tamper-proof
  el.style.position = "absolute"
  el.style.left = "-9999px" // Move outside the screen to make it invisible
  document.body.appendChild(el) // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false // Mark as false to know no selection existed before
  el.select() // Select the <textarea> content
  document.execCommand("copy") // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el) // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection().removeAllRanges() // Unselect everything on the HTML document
    document.getSelection().addRange(selected) // Restore the original selection
  }
}

function getClassNames(node) {
  return [
    node.className,
    ...Array.from(node.children).map(getClassNames),
  ].flat()
}

export const getCSS = node => {
  const classNames = getClassNames(node)
    .map(name => name.split(" "))
    .flat()
    .map(name => `.${name}`)

  // Gets CSS for the entire page
  const cssStyles = Array.from(document.head.getElementsByTagName("style"))
    .map(style => style.innerHTML)
    .join("")

  const parsedCSS = css.parse(cssStyles)
  parsedCSS.stylesheet.rules = parsedCSS.stylesheet.rules
    .filter(rule => rule.type === "rule")
    .filter(rule =>
      rule.selectors.some(selector =>
        classNames.some(name => name === selector)
      )
    )

  const styles = css.stringify(parsedCSS)

  return styles
}
