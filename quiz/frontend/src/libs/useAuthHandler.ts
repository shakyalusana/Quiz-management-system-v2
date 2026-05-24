import { USERAUTHAPI } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { saveUser } from "./storage";
import type { LoginInput, RegisterInput } from "./validationSchema";
import { setUserInfo } from "@/hooks/useUserStorage";

const useAuthHandler = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending: isLoggingIn } = USERAUTHAPI.useUserLogin();

  const { mutate: register, isPending: isRegistering } =
    USERAUTHAPI.useUserRegister();

  const handleLogin = (data: LoginInput) => {
    login(data, {
      onSuccess: (response) => {
        const accessToken = response?.token;
        const user = response?.user;

        saveUser(accessToken);
        setUserInfo(user);
        if (!accessToken || !user) {
          toast.error("Login failed");
          return;
        }

        queryClient.setQueryData(["authToken"], accessToken);
        toast.success("Login successful");

        navigate("/dashboard", { replace: true });
      },
    });
  };

  const handleRegister = (data: RegisterInput) => {
    register(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        navigate("/login", { replace: true });
      },
    });
  };

  return {
    handleLogin,
    handleRegister,
    isLoggingIn,
    isRegistering,
  };
};

export { useAuthHandler };
