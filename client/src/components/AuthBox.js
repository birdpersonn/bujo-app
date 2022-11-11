import React from "react";

const AuthBox = ({ register }) => {
  return (
    <div className="auth">
      <div className="auth__box">
        <div className="auth__header">
          <h1>{register ? "register" : "log in"}</h1>
        </div>

        <form>
          {register && (
            <div className="auth__field">
              <label>name</label>
              <input type="text" />
            </div>
          )}

          <div className="auth__field">
            <label>email</label>
            <input type="text" />
          </div>

          <div className="auth__field">
            <label>password</label>
            <input type="password" />
          </div>

          {register && (
            <div className="auth__field">
              <label>confirm password</label>
              <input type="password" />

              {/* <p className="auth__error">something went wrong</p> */}
            </div>
          )}

          <div className="auth__footer">
            <p className="auth__error">something went wrong</p>

            <button className="btn">{register ? "register" : "log in"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthBox;
