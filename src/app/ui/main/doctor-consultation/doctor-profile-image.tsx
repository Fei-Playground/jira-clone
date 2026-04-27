import { forwardRef } from "react";
import cx from "classix";

export const DoctorProfileImage = forwardRef<
  HTMLDivElement,
  DoctorProfileImageProps
>(
  (
    {
      mainImage,
      mainImageAlt = "Doctor profile",
      secondaryImages = [],
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cx(
          "relative flex items-center justify-center",
          className
        )}
      >
        {/* Main central profile image */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="h-[220px] w-[180px] overflow-hidden rounded-[40px] border-4 border-background-neutral shadow-lg">
            {mainImage ? (
              <img
                src={mainImage}
                alt={mainImageAlt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-background-neutral-subtle">
                <span className="text-font-subtle">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Secondary profile images arranged around the main image */}
        {secondaryImages.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Top-left secondary image */}
            {secondaryImages[0] && (
              <div className="absolute left-0 top-4 z-0 h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-background-neutral shadow">
                <img
                  src={secondaryImages[0]}
                  alt="Secondary profile"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Top-right secondary image */}
            {secondaryImages[1] && (
              <div className="absolute right-2 top-8 z-0 h-[50px] w-[50px] overflow-hidden rounded-full border-2 border-background-neutral shadow">
                <img
                  src={secondaryImages[1]}
                  alt="Secondary profile"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Bottom-left secondary image */}
            {secondaryImages[2] && (
              <div className="absolute bottom-8 left-4 z-0 h-[50px] w-[50px] overflow-hidden rounded-full border-2 border-background-neutral shadow">
                <img
                  src={secondaryImages[2]}
                  alt="Secondary profile"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Bottom-right secondary image */}
            {secondaryImages[3] && (
              <div className="absolute bottom-4 right-0 z-0 h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-background-neutral shadow">
                <img
                  src={secondaryImages[3]}
                  alt="Secondary profile"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

DoctorProfileImage.displayName = "DoctorProfileImage";

export interface DoctorProfileImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mainImage?: string;
  mainImageAlt?: string;
  secondaryImages?: string[];
}
