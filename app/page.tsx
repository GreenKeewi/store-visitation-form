import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm md:max-w-1/2 flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/lightModeVersion.png"
            width={300}
            height={50}
            alt="Store Visitation Tracker Logo"
          />
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
