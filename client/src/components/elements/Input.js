import classnames from "classnames";
export const Input = (
  attrs = {
    id: String,
    value: String,
    type: String,
    caption: String,
    error: String,
    disabled: Boolean,
    onChange: () => {},
    autocomp: String,
    autoFocus: Boolean,
    classnames:String
  }
) => {
  const {
    id,
    value,
    type,
    caption,
    error,
    disabled,
    onChange,
    autocomp,
    autoFocus,
    classnames:classes
  } = attrs;
  return (
    <div
      className={`w3-col input-field ${classes}`}
      key={id}
      style={{ padding: "0 20px" }}
    >
      <input
        id={id}
        value={value}
        type={type}
        error={error}
        disabled={disabled||false}
        autoComplete={autocomp}
        onChange={onChange}
        autoFocus={autoFocus||false}
        className={classnames("", {
          invalid: error,
        })}
      />
      <label htmlFor={id} style={{ padding: "0 0 0 24px" }}>
        {caption}
      </label>
      <span className="red-text">{error}</span>
    </div>
  );
};
