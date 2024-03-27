import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCartShopping,
  faMagnifyingGlass,
  faPhone,
  faComments,
  faBars,
  faCaretDown,
  faDongSign,
  faChevronRight,
  faCircleCheck,
  faCircleXmark,
  faCartPlus,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

import { faFacebook } from '@fortawesome/free-brands-svg-icons';

// Add icons to library
library.add(
  faCartShopping,
  faMagnifyingGlass,
  faPhone,
  faComments,
  faBars,
  faCaretDown,
  faDongSign,
  faChevronRight,
  faCircleCheck,
  faCircleXmark,
  faCartPlus,
  faAngleDoubleRight,
  faFacebook
);

export const iconPlugin = {
  install(app) {
    app.component('font-awesome-icon', FontAwesomeIcon);
  }
};
