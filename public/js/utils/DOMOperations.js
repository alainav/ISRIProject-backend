/**
 * Sistema de Componentes Reactivos - Versión Final
 * @module DOMOperations
 */

const State = new Proxy(
  { count: 0 },
  {
    set(target, key, value) {
      target[key] = value;
      ComponentManager.updateComponents(key);
      return true;
    },
  }
);

const ComponentManager = {
  components: new Map(),

  async init() {
    await this.loadComponents();
    this.bindGlobalEvents();
  },

  async loadComponents() {
    const elements = document.querySelectorAll("[data-component]");
    for (const element of elements) {
      const templatePath = element.getAttribute("data-component");
      const template = await this.fetchTemplate(templatePath);
      this.registerComponent(element, template);
      this.renderComponent(element, template);
    }
  },

  async fetchTemplate(path) {
    const response = await fetch(path);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.querySelector("template").innerHTML;
  },

  registerComponent(element, template) {
    const dependencies = this.extractDependencies(template);
    this.components.set(element, { template, dependencies });
  },

  extractDependencies(template) {
    const matches = [...template.matchAll(/\{\{(\w+)\}\}/g)];
    return [...new Set(matches.map((match) => match[1]))];
  },

  renderComponent(element, template) {
    const html = this.parseTemplate(template, element);
    element.innerHTML = html;
  },

  parseTemplate(template, element) {
    const props = this.getElementProps(element);
    return template.replace(
      /\{\{(\w+)\}\}/g,
      (_, key) => props[key] || State[key] || ""
    );
  },

  getElementProps(element) {
    return Array.from(element.attributes).reduce((props, attr) => {
      if (attr.name !== "data-component") props[attr.name] = attr.value;
      return props;
    }, {});
  },

  updateComponents(updatedProp) {
    this.components.forEach((comp, element) => {
      if (comp.dependencies.includes(updatedProp)) {
        this.renderComponent(element, comp.template);
      }
    });
  },

  bindGlobalEvents() {
    /*window.handleIncrement = () => {
      State.count++;
      console.log("Contador actualizado:", State.count);
    };*/
  },
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => ComponentManager.init());
window.State = State; // Para depuración
