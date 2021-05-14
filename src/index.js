import {appStart, setRoutes} from "./frame";
import routes from "./json/routes";
appStart().then(() => {
  setRoutes(routes);
});
