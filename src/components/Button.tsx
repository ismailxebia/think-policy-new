import React, { forwardRef } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "text-white [background:linear-gradient(180deg,#2192DE_0%,#101A49_100%)] [box-shadow:0_-1.5px_1px_0_#1A6293_inset,0_0_8px_0_#5DBCFB_inset] hover:brightness-110 active:brightness-95",
  secondary:
    "text-[#18181B] bg-white [box-shadow:0_-1px_2px_0_rgba(0,0,0,0.10)_inset,0_1px_2px_0_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-[#FAFAFA] active:bg-[#F4F4F5]",
};

const sizeStyles: Record<ButtonSize, { container: string; icon: string }> = {
  sm: {
    container: "h-[28px] px-2.5 sm:px-3 text-[13px] gap-1.5",
    icon: "w-4 h-4",
  },
  md: {
    container: "h-[32px] px-3.5 sm:px-4 text-[14px] gap-2",
    icon: "w-4 h-4",
  },
  lg: {
    container: "h-[40px] px-5 sm:px-6 text-[15px] gap-2.5",
    icon: "w-5 h-5",
  },
};

/**
 * Reusable Figma Pill Button Component
 * - Primary: Blue gradient with inner cyan highlight & shadow
 * - Secondary: Clean white pill with subtle border ring and soft shadow
 * - Sizes: sm (28px), md (32px), lg (40px)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      href,
      target,
      rel,
      fullWidth = false,
      disabled = false,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "relative inline-flex items-center justify-center rounded-[320px] font-inter font-medium leading-[20px] whitespace-nowrap transition-all duration-150 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2192DE] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const combinedClassName = `${baseClasses} ${sizeStyles[size].container} ${
      variantStyles[variant]
    } ${fullWidth ? "w-full" : "w-auto"} ${className}`;

    const content = (
      <>
        {leftIcon && (
          <span
            className={`inline-flex shrink-0 items-center justify-center ${sizeStyles[size].icon}`}
          >
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {rightIcon && (
          <span
            className={`inline-flex shrink-0 items-center justify-center ${sizeStyles[size].icon}`}
          >
            {rightIcon}
          </span>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * UserCirclePlus Icon matching Figma "UserCirclePlus" node (16x16)
 */
export function UserCirclePlusIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      {/* Circle Body */}
      <circle
        cx="8"
        cy="8"
        r="6.5"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Head */}
      <circle cx="8" cy="6" r="2" strokeWidth="1.2" stroke="currentColor" />
      {/* Shoulder arc */}
      <path
        d="M4.5 12.2C5.3 10.9 6.6 10.2 8 10.2C9.4 10.2 10.7 10.9 11.5 12.2"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Plus badge on top right */}
      <path
        d="M12.5 3.5V6.5M11 5H14"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Button;
