export const Dialog = {
  alert:(data={heading:String,body:String,})=>{

  },
  custom: (
    data = {
      ref: (Chat) => {
        this.Chat = Chat;
      },
      classes: String,
      content: <div style={{ width: "fit-content", height: "100vh" }}></div>,
    }
  ) => {
    return (
      <div ref={data.ref} className={`modal ${data.classes}`}>
        {data.content}
      </div>
    );
  },
};
