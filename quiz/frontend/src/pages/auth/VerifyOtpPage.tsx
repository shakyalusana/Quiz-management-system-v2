import { useState } from "react";

import { motion } from "framer-motion";

import { ShieldCheck, Loader2, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { USERAUTHAPI } from "@/api/auth";

import { saveUser } from "@/libs/storage";

import { setUserInfo } from "@/hooks/useUserStorage";

import { useNavigate } from "react-router-dom";

export default function VerifyOtpPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const email = sessionStorage.getItem("pendingVerificationEmail") || "";

  const { mutate: verifyOtp, isPending } = USERAUTHAPI.useVerifyOtp();

  const { mutate: resendOtp, isPending: isResending } =
    USERAUTHAPI.useResendOtp();

  const handleVerify = () => {
    verifyOtp(
      {
        email,
        otp,
      },
      {
        onSuccess: (response) => {
          saveUser(response.token);

          setUserInfo(response.user);

          toast.success("Email verified successfully");

          sessionStorage.removeItem("pendingVerificationEmail");

          navigate("/dashboard");
        },
      },
    );
  };

  const handleResend = () => {
    resendOtp(email, {
      onSuccess: (response) => {
        toast.success(response.message);
      },
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="text-center"
      >
        <ShieldCheck className="h-14 w-14 mx-auto text-primary mb-4" />

        <h1 className="text-3xl font-bold">Verify Email</h1>

        <p className="text-muted-foreground mt-2">OTP sent to</p>

        <p className="font-semibold">{email}</p>
      </motion.div>

      <div className="space-y-4">
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          className="h-12 text-center text-xl tracking-widest"
        />

        <Button
          onClick={handleVerify}
          disabled={isPending}
          className="w-full h-12"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Resend OTP
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
