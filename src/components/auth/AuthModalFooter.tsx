interface AuthModalFooterProps {
  mode: "login" | "register" | "reset";
  onModeChange: (mode: "login" | "register" | "reset") => void;
}

export const AuthModalFooter = ({ mode, onModeChange }: AuthModalFooterProps) => {
  return (
    <div className="mt-4 text-center space-y-2">
      {mode === "login" && (
        <>
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => onModeChange("register")}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
          <p>
            <button
              onClick={() => onModeChange("reset")}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        </>
      )}
      {(mode === "register" || mode === "reset") && (
        <p>
          Already have an account?{" "}
          <button
            onClick={() => onModeChange("login")}
            className="text-blue-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      )}
    </div>
  );
};