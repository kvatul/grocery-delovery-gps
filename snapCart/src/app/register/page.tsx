"use client";
import RegisterForm from "@/components/RegisterForm";
import Welcome from "@/components/Welcome";
import { useState } from "react";

const Register = () => {
  const [step, setStep] = useState(1);

  return (
    <div>
      {step == 1 ? (
        <Welcome nextstep={setStep} />
      ) : (
        <RegisterForm nextstep={setStep} />
      )}
    </div>
  );
};

export default Register;
