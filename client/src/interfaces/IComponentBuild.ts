import Blessed from "blessed";

export default interface IComponentBuild {
  screen: Blessed.Widgets.Screen;
  chat: Blessed.Widgets.ListElement;
  input: Blessed.Widgets.TextareaElement;
  status: Blessed.Widgets.ListElement;
  activityLog: Blessed.Widgets.ListElement;
}
