export class ImagePatterns {
    patterns: Map<string, SVGPatternElement> = new Map()

    addPattern(svg: SVGSVGElement, key: string, sizes: { width: number, height: number }) {
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", 'pattern')
        svg.appendChild(pattern)
        pattern.setAttribute('id', key)
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')
        pattern.setAttribute('width', `${sizes.width}px`)
        pattern.setAttribute('height', `${sizes.height}px`)

        const image = document.createElementNS("http://www.w3.org/2000/svg", 'image')
        image.setAttribute('width', `${sizes.width}px`)
        image.setAttribute('height', `${sizes.height}px`)
        image.setAttribute('href', key)
    }
}