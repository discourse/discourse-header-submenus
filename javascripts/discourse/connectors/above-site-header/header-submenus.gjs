import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import icon from "discourse/helpers/d-icon";

// Used instead of dasherize for backwards compatibility with stable
const getClassName = (text) => {
  return text.toLowerCase().replace(/\s/g, "-");
};

@classNames("above-site-header-outlet", "header-submenus")
export default class HeaderSubmenus extends Component {
  init() {
    super.init(...arguments);

    try {
      const splitMenuItems = settings.Menu_items.split("|").filter(Boolean);
      const splitSubmenuItems =
        settings.Submenu_items.split("|").filter(Boolean);
      const menuItemsArray = [];
      const SubmenuItemsArray = [];
      splitSubmenuItems.forEach((item) => {
        const fragments = item.split(",").map((fragment) => fragment.trim());
        const parent = fragments[0].toLowerCase();
        const text = fragments[1];
        if (text.toLowerCase() === "divider") {
          const divider = {
            parent,
            divider: true,
          };
          return SubmenuItemsArray.push(divider);
        }
        const className = getClassName(text);
        const itemIcon =
          fragments[2].toLowerCase() === "none"
            ? ""
            : fragments[2].toLowerCase();
        const href = fragments[3];
        const target = fragments[4] === "blank" ? "_blank" : "";
        const title = fragments[5];
        const submenuItem = {
          parent,
          text,
          className,
          icon: itemIcon,
          href,
          target,
          title,
        };
        SubmenuItemsArray.push(submenuItem);
      });
      splitMenuItems.forEach((item) => {
        const fragments = item.split(",").map((fragment) => fragment.trim());
        const parentFor = fragments[0].toLowerCase();
        const text = fragments[0];
        const className = getClassName(text);
        const itemIcon =
          fragments[1].toLowerCase() === "none"
            ? ""
            : fragments[1].toLowerCase();
        const title = fragments[2];
        const view = fragments[3];
        const childItems = SubmenuItemsArray.filter(
          (link) => link.parent === parentFor
        );
        const menuItem = {
          text,
          className,
          icon: itemIcon,
          title,
          view,
          childItems,
        };
        menuItemsArray.push(menuItem);
      });
      const showCaret = settings.Show_caret;
      this.setProperties({
        menuItems: menuItemsArray,
        showCaret,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        error,
        "There's an issue in the Header Submenus Component. Check if your settings are entered correctly"
      );
    }
  }

  <template>
    <div id="top-menu" class="top-menu">
      <div class="menu-content wrap">
        <div class="menu-placeholder">
          <div class="menu-item-container">
            <div class="menu-items">
              {{#each this.menuItems as |item|}}
                <a
                  class="menu-item {{item.view}} {{item.className}}"
                  title={{item.title}}
                >
                  {{#if item.icon}}
                    {{icon item.icon}}
                  {{/if}}

                  {{item.text}}

                  {{#if this.showCaret}}
                    {{icon "caret-right"}}
                  {{/if}}

                  <div class="d-header-dropdown">
                    <ul class="d-dropdown-menu">
                      {{#each item.childItems as |child|}}
                        {{#if child.divider}}
                          <li class="divider"></li>
                        {{else}}
                          <li class="submenu-item {{child.className}}">
                            <a
                              target={{child.target}}
                              title={{child.title}}
                              class="submenu-link"
                              href={{child.href}}
                            >
                              {{#if child.icon}}
                                {{icon child.icon}}
                              {{/if}}

                              {{child.text}}
                            </a>
                          </li>
                        {{/if}}
                      {{/each}}
                    </ul>
                  </div>
                </a>
              {{/each}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
}
