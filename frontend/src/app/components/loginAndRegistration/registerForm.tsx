import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useTransition,
} from "react";
import { register, State } from "@/app/lib/actions";
import { Button } from "../ui/button";
import { StarsIcon } from "lucide-react";

export default function RegisterForm({
  authMode,
  setAuthMode,
}: {
  authMode: string;
  setAuthMode: Dispatch<SetStateAction<string>>;
}) {
  const initialState: State = { message: null, errors: {}, success: false };
  const [state, registerFormAction, isPending] = useActionState(
    register,
    initialState
  );
  const [isPendingTransition, startTransition] = useTransition();

  useEffect(() => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.reset();
    }
  }, [authMode]);

  const handleGoToLogin = () => {
    startTransition(() => {
      setAuthMode("login");
      registerFormAction(new FormData());
    });
  };

  if (state.success) {
    return (
      <div className="space-y-4 px-6 py-20">
        <div className="text-xl flex items-center pb-5">
          <StarsIcon className="mr-2 w-15"></StarsIcon>
          <p>Registration successful! You can now log in.</p>
        </div>
        <Button
          onClick={handleGoToLogin}
          className="w-full uppercase"
          disabled={isPendingTransition}
        >
          {isPendingTransition ? "Processing..." : "Go to Sign In"}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <form action={registerFormAction} className="space-y-2">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="firstName"
            >
              First Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                required={authMode === "register"}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.firstName &&
              state?.errors.firstName.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          <div>
            <label
              className="mb-3 mt-3 block text-xs font-medium text-gray-900"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                required={authMode === "register"}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.lastName &&
              state?.errors.lastName.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div>
            <label
              className="mb-3 mt-3 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.email &&
              state?.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-3 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {state?.errors?.password &&
              state?.errors.password.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <Button className="mt-6 w-full uppercase" aria-disabled={isPending}>
            Register
            <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>

          <div className="flex h-8 items-end space-x-1">
            {state?.message && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{state.message}</p>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
