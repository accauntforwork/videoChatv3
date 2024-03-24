import { useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Emailni validatsiya qilish
    const email = emailRef.current.value.trim();
    if (!email) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Passwordni validatsiya qilish
    const password = passwordRef.current.value.trim();
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    // Qayta kiritilgan passwordni avvalgisi bn tengligini tekshirish
    const repeatPassword = repeatPasswordRef.current.value.trim();
    if (!repeatPassword) {
      newErrors.repeatPassword = "Please repeat the password";
      isValid = false;
    } else if (repeatPassword !== password) {
      newErrors.repeatPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      const email = emailRef.current.value.trim();
      const password = passwordRef.current.value.trim();

      localStorage.setItem("user1", JSON.stringify({ email, password }));

      setIsLoading(false);
      navigate("/login");
    } else {
      console.log("Form validation failed!");
    }
  };

  return (
    <div className="flex items-center flex-col pb-96">
      <div className="w-[400px] p-8 bg-[#161D2F] bg-opacity-40 rounded-[20px] mt-40">
        <h2 className="text-4xl text-white mb-10">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email address"
            ref={emailRef}
            className={`border-b-2 pl-4 pb-5 outline-none w-full bg-transparent text-white mb-6 border-[#5A698F] ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            className={`border-b-2 pl-4 pb-5 outline-none w-full bg-transparent text-white mb-6 border-[#5A698F] ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}

          <input
            type="password"
            placeholder="Repeat password"
            ref={repeatPasswordRef}
            className={`border-b-2 pl-4 pb-5 outline-none w-full bg-transparent text-white mb-6 border-[#5A698F] ${
              errors.repeatPassword ? "border-red-500" : ""
            }`}
          />
          {errors.repeatPassword && (
            <p className="text-red-500 text-sm mb-2">{errors.repeatPassword}</p>
          )}

          <button
            type="submit"
            className="rounded-sm py-4 px-24 text-sm text-white bg-[#FC4747] mb-6 w-full"
            disabled={isLoading}
            // onClick={() => navigate(
            //   validateForm()?'/login':'/register'
            // )}
          >
            {isLoading ? "Sending..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-white text-[15px]">
          Already have an account?{" "}
          <span
            className="text-[#FC4747] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
      <Outlet></Outlet>
    </div>
  );
}

export default Register;
