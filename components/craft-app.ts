import { createApp, defineComponent, h, ref } from "vue";
const interests = [{
  id: "running",
  label: "Running",
  kicker: "Endurance & discipline",
  title: "A different kind of progress.",
  text: "Long-distance running is my reset. One steady effort at a time—building patience and consistency beyond the screen.",
  icon: "M4 17l4-5 4 2 4-7M13 7h3v3M4 21h16"
}, {
  id: "traveling",
  label: "Traveling",
  kicker: "New places & perspectives",
  title: "A little further from the familiar.",
  text: "I enjoy exploring new places and the change of perspective that comes with being somewhere different.",
  icon: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6M9 3v15M15 6v15"
}, {
  id: "anime",
  label: "Watching anime",
  kicker: "Stories & imagination",
  title: "Another world to get lost in.",
  text: "Watching anime is how I unwind—with imaginative worlds, memorable characters, and stories that stay with me.",
  icon: "M4 4h16v12H4zM8 20h8M12 16v4M10 7l5 3-5 3V7"
}, {
  id: "infrastructure",
  label: "Infrastructure",
  kicker: "Containers & cloud",
  title: "Curious about what’s underneath.",
  text: "Exploring Docker, Kubernetes, and cloud infrastructure to understand how reliable applications are delivered and kept running.",
  icon: "M12 3l9 5v9l-9 5-9-5V8l9-5M3 8l9 5 9-5M12 13v9"
}, {
  id: "automation",
  label: "Python & automation",
  kicker: "Small tools, useful outcomes",
  title: "Make room for the interesting work.",
  text: "Experimenting with Python and Pillow for image processing, data transformation, and the repetitive tasks worth automating.",
  icon: "M8 4L3 12l5 8M16 4l5 8-5 8M14 3l-4 18"
}, {
  id: "freelance",
  label: "Collaboration",
  kicker: "Work beyond borders",
  title: "Different perspectives. Better ideas.",
  text: "Freelance projects bring new problems and new people into the mix. I enjoy turning a shared idea into something useful.",
  icon: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M16 4a4 4 0 010 8M22 21v-2a4 4 0 00-3-4M13 7a4 4 0 11-8 0 4 4 0 018 0"
}];
// The installed primitives are React-only. This Vue island uses semantic tabs,
// roving focus, and automatic arrow-key activation without sharing DOM ownership.
const CraftApp = defineComponent({
  setup() {
    const selected = ref(0);
    const buttons: HTMLButtonElement[] = [];
    function keyboard(event: KeyboardEvent, index: number) {
      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % interests.length;else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + interests.length) % interests.length;else if (event.key === "Home") next = 0;else if (event.key === "End") next = interests.length - 1;else return;
      event.preventDefault();
      selected.value = next;
      buttons[next]?.focus();
    }
    return () => h("div", {
      class: "craft-explorer"
    }, [h("div", {
      class: "craft-tabs",
      role: "tablist",
      "aria-label": "Interests beyond code"
    }, interests.map((item, index) => h("button", {
      class: "craft-tab",
      role: "tab",
      type: "button",
      id: `craft-tab-${item.id}`,
      "aria-selected": selected.value === index,
      "aria-controls": `craft-panel-${item.id}`,
      tabindex: selected.value === index ? 0 : -1,
      ref: (el: unknown) => {
        if (el) buttons[index] = el as HTMLButtonElement;
      },
      onClick: () => {
        selected.value = index;
      },
      onKeydown: (e: KeyboardEvent) => keyboard(e, index)
    }, [h("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 1.5,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true"
    }, [h("path", {
      d: item.icon
    })]), item.label]))), ...interests.map((item, index) => h("div", {
      class: "craft-detail",
      role: "tabpanel",
      id: `craft-panel-${item.id}`,
      "aria-labelledby": `craft-tab-${item.id}`,
      tabindex: 0,
      hidden: selected.value !== index
    }, [h("div", {
      class: "craft-kicker"
    }, item.kicker), h("h3", item.title), h("p", item.text)]))]);
  }
});
export function mountCraft(element: HTMLElement) {
  const app = createApp(CraftApp);
  app.mount(element);
  return () => app.unmount();
}
