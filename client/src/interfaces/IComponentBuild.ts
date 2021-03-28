import Blessed from "blessed";

export default interface IComponentBuild {
  screen: Blessed.Widgets.Screen;
  layout: Blessed.Widgets.LayoutElement;
  input: Blessed.Widgets.TextareaElement;
  chat: Blessed.Widgets.ListElement;
  status: Blessed.Widgets.ListElement;
  activityLog: Blessed.Widgets.ListElement;
}
