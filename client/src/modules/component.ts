export class Component {
  element: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap = 'div', styles: string[] = [], content?: string | null, parent?: HTMLElement | null, attr?: string | null, attrVal?: string | null) {
    this.element = document.createElement(tag);
    if (styles.length > 0) this.element.classList.add(...styles);
    if (content) this.element.innerHTML = `${content}`;
    if (attr) this.element.setAttribute(attr, `${attrVal}`);
    if (parent) parent.appendChild(this.element);
  }

  destroy(): void {
    this.element.remove();
  }
}
