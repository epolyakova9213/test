export class ImagePatterns {

    addPattern(svg: SVGSVGElement, key: string, sizes: { width: number, height: number }) {
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", 'pattern')
        svg.appendChild(pattern)
        pattern.setAttribute('id', key)
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')
        pattern.setAttribute('width', `${sizes.width}px`)
        pattern.setAttribute('height', `${sizes.height}px`)
        pattern.setAttribute('x', `${-sizes.width / 2}px`)
        pattern.setAttribute('y', `${-sizes.height / 2}px`)

        const image = document.createElementNS("http://www.w3.org/2000/svg", 'image')
        image.setAttribute('width', `${sizes.width}px`)
        image.setAttribute('height', `${sizes.height}px`)
        image.setAttribute('href', key)

        pattern.appendChild(image)
    }
}