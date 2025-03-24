import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0002-migrate-from-deprecated-icon-names";

module(
  "Unit | Migrations | Settings | 0002-migrate-from-deprecated-icon-names",
  function () {
    test("migrate icon names in Menu_items", function (assert) {
      const settings = new Map(
        Object.entries({
          Menu_items:
            "Design, magic, Get inspired!, vdm|Code, far-keyboard, Learn new things!, vdm|Business, far-money-bill-alt, Start a new career!, vdm|Shop, shopping-cart, Buy cool stuff!, vdo",
        })
      );

      const result = migrate(settings);

      assert.strictEqual(
        result.get("Menu_items"),
        "Design, wand-magic, Get inspired!, vdm|Code, far-keyboard, Learn new things!, vdm|Business, far-money-bill-1, Start a new career!, vdm|Shop, cart-shopping, Buy cool stuff!, vdo"
      );
    });

    test("migrate icon names in Submenu_items", function (assert) {
      const settings = new Map(
        Object.entries({
          Submenu_items:
            "Design, Galleries, th, #, blank, Cool galleries|Design, Design process, far-book-alt, #, blank, Learn|Design, divider|Design, Freebies, gift, #, blank, Freebies!",
        })
      );

      const result = migrate(settings);

      assert.strictEqual(
        result.get("Submenu_items"),
        "Design, Galleries, table-cells, #, blank, Cool galleries|Design, Design process, far-book-blank, #, blank, Learn|Design, divider|Design, Freebies, gift, #, blank, Freebies!"
      );
    });

    test("migrate icon names in Svg_icons", function (assert) {
      const settings = new Map(
        Object.entries({
          Svg_icons:
            "fa-th|fa-magic|far-keyboard|far-money-bill-alt|fa-shopping-cart|far-lightbulb|fa-columns|fa-gift",
        })
      );

      const result = migrate(settings);

      assert.strictEqual(
        result.get("Svg_icons"),
        "table-cells|wand-magic|far-keyboard|far-money-bill-1|cart-shopping|far-lightbulb|table-columns|gift"
      );
    });

    test("migrate empty settings", function (assert) {
      const settings = new Map(Object.entries({}));
      const result = migrate(settings);
      assert.strictEqual(Array.from(result).length, 0);
    });

    test("migrate settings with no icon changes needed", function (assert) {
      const settings = new Map(
        Object.entries({
          Menu_items: "Design, none, Get inspired!, vdm",
        })
      );
      const result = migrate(settings);
      assert.strictEqual(
        result.get("Menu_items"),
        "Design, none, Get inspired!, vdm"
      );
    });
  }
);
