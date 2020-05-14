// Used instead of dasherize for backwards compatibility with stable
const getClassName = text => {
  return text.toLowerCase().replace(/\s/g, "-");
};

export default {
  setupComponent(args, component) {
    try {
      const splitMenuItems = settings.Menu_items.split("|").filter(Boolean);
      const splitSubmenuItems = settings.Submenu_items.split("|").filter(
        Boolean
      );

      const menuItemsArray = [];
      const SubmenuItemsArray = [];

      splitSubmenuItems.forEach(item => {
        const fragments = item.split(",").map(fragment => fragment.trim());
        const parent = fragments[0].toLowerCase();
        const text = fragments[1];

        if (text.toLowerCase() === "divider") {
          const divider = {
            parent,
            divider: true
          };
          return SubmenuItemsArray.push(divider);
        }

        const className = getClassName(text);
        const icon =
          fragments[2].toLowerCase() === "none"
            ? ""
            : fragments[2].toLowerCase();
        const href = fragments[3];
        const target = fragments[4] === "blank" ? "_blank" : "";
        const title = fragments[5];

        const submenItem = {
          parent,
          text,
          className,
          icon,
          href,
          target,
          title
        };
        SubmenuItemsArray.push(submenItem);
      });

      splitMenuItems.forEach(item => {
        const fragments = item.split(",").map(fragment => fragment.trim());
        const parentFor = fragments[0].toLowerCase();
        const text = fragments[0];
        const className = getClassName(text);
        const icon =
          fragments[1].toLowerCase() === "none"
            ? ""
            : fragments[1].toLowerCase();
        const title = fragments[2];
        const view = fragments[3];
        const childItems = SubmenuItemsArray.filter(
          link => link.parent === parentFor
        );

        const menuItem = {
          text,
          className,
          icon,
          title,
          view,
          childItems
        };
        menuItemsArray.push(menuItem);
      });

      const showCaret = settings.Show_caret;

      this.setProperties({
        menuItems: menuItemsArray,
        showCaret
      });
    } catch (error) {
      console.error(error);
      console.error(
        "There's an issue in the Header Submenus Component. Check if your settings are entered correctly"
      );
    }
  }
};
