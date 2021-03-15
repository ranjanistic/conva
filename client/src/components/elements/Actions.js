import { Loading } from "./Loader";

export const Actions = (isLoading = false, ...actions) => {
  if (isLoading) {
    return Loading();
  }
  let buttons = [];
  actions.forEach((act, a) => {
    buttons.push(
      <button
        key={`action${a}`}
        style={{
          borderRadius: "3px",
          marginTop: "1rem",
          marginRight: "12px",
        }}
        onClick={act.onclick || ((_) => {})}
        className={`btn btn-${act.size||'large'} waves-effect waves-blue ${
          act.color || "blue"
        } accent-3 ${act.classnames}`}
      >
        {act.name}
      </button>
    );
  });
  return buttons;
};
