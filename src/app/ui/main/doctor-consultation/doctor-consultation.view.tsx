import { Button } from "@app/components/button";
import { DoctorProfileImage } from "./doctor-profile-image";
import { HighlightedText } from "./highlighted-text";
import { PreferenceList } from "./preference-list";

export const DoctorConsultationView = ({
  onContinue,
}: DoctorConsultationViewProps): JSX.Element => {
  // Mock data for doctor preferences
  const preferenceItems = [
    {
      text: "You want a doctor who values your wellbeing.",
      isSelected: true,
    },
    {
      text: "You are looking for a doctor skilled in preventative medicine.",
      isSelected: true,
    },
    {
      text: "You need a doctor who offers virtual consultations.",
      isSelected: true,
    },
    {
      text: "You prefer a doctor who is known for clear communication.",
      isSelected: true,
    },
    {
      text: "You prefer a doctor who respects your cultural background.",
      isSelected: true,
    },
  ];

  // Mock doctor profile images
  const mainDoctorImage =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop";
  const secondaryDoctorImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507527173995-5f5ee139fbaa?w=100&h=100&fit=crop",
  ];

  return (
    <div className="flex flex-col gap-8 bg-elevation-surface px-6 py-8">
      {/* Header with branding */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-primary-bold text-lg text-font-danger">CareLoop</h1>
          <p className="font-primary text-xs text-font-subtle">
            CareLoop.com
          </p>
        </div>
        {/* Status indicator placeholder */}
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-font-subtle" />
          <div className="h-2 w-2 rounded-full bg-font-subtle" />
          <div className="h-2 w-2 rounded-full bg-font-subtle" />
        </div>
      </div>

      {/* Main section */}
      <div className="flex flex-col gap-8">
        {/* Doctor Profile Images Section */}
        <div className="flex justify-center">
          <DoctorProfileImage
            mainImage={mainDoctorImage}
            mainImageAlt="Main doctor profile"
            secondaryImages={secondaryDoctorImages}
            className="h-[320px] w-full max-w-[320px]"
          />
        </div>

        {/* Hero heading */}
        <div className="text-center">
          <h2 className="font-primary-bold text-xl text-font-danger leading-relaxed">
            Finding Your perfect Doctor
          </h2>
        </div>

        {/* Highlighted consultation text section */}
        <div className="rounded-lg bg-background-neutral-subtle p-4">
          <p className="font-primary text-sm leading-relaxed text-font-danger">
            <HighlightedText
              text="You need a doctor who offers virtual consultations."
              highlights={["offers virtual consultations"]}
            />
          </p>
        </div>

        {/* Preferences list section */}
        <div className="flex flex-col gap-4">
          <PreferenceList items={preferenceItems} />
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <Button
            onClick={onContinue}
            color="primary"
            variant="contained"
            size="md"
            className="w-full max-w-xs"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export interface DoctorConsultationViewProps {
  onContinue?: () => void;
}
