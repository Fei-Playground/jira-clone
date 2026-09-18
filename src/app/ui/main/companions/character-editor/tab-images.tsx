import { useRef, useState } from "react";
import {
  RiCloseLine,
  RiStarFill,
  RiStarLine,
  RiUploadLine,
} from "react-icons/ri";
import { v4 as uuid } from "uuid";
import { CharacterImage } from "@domain/character";
import { Button } from "@app/components/button";
import { useTranslation } from "@app/store/locale.store";

const MAX_IMAGES = 6;

export const TabImages = ({
  images,
  setImages,
}: TabImagesProps): JSX.Element => {
  const { t } = useTranslation();
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = (url: string) => {
    if (!url.trim() || images.length >= MAX_IMAGES) return;
    const newImage: CharacterImage = {
      id: uuid(),
      url: url.trim(),
      isPrimary: images.length === 0,
    };
    setImages([...images, newImage]);
  };

  const removeImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const setPrimary = (id: string) => {
    setImages(
      images.map((image) => ({ ...image, isPrimary: image.id === id }))
    );
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") addImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-font-subtlest">
        {t("companions.card.imagesHint")}
      </p>

      <div className="flex gap-2">
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder={t("companions.card.imageUrlPlaceholder")}
          aria-label={t("companions.card.addImageUrl")}
          className="flex-1 rounded-md border-none bg-background-input p-2 text-sm outline outline-2 outline-border-input hover:bg-background-input-hovered focus:outline-border-brand"
        />
        <Button
          color="neutral"
          variant="subtlest"
          onClick={() => {
            addImage(urlDraft);
            setUrlDraft("");
          }}
          disabled={!urlDraft.trim() || images.length >= MAX_IMAGES}
          aria-label={t("companions.card.addImage")}
        >
          {t("companions.card.addImage")}
        </Button>
        <Button
          color="neutral"
          variant="subtlest"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= MAX_IMAGES}
          aria-label={t("companions.card.uploadImage")}
        >
          <RiUploadLine size={16} />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-font-subtlest">
          {t("companions.card.noImagesYet")}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-md border border-border"
            >
              <img
                src={image.url}
                alt={image.caption ?? ""}
                className="h-24 w-full object-cover"
              />
              {image.isPrimary && (
                <span className="absolute left-1 top-1 rounded bg-background-brand-bold px-1.5 py-0.5 text-2xs text-font-inverse">
                  {t("companions.card.primaryImageBadge")}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-black/40 p-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setPrimary(image.id)}
                  aria-label={t("companions.card.setPrimaryImage")}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
                >
                  {image.isPrimary ? (
                    <RiStarFill size={14} />
                  ) : (
                    <RiStarLine size={14} />
                  )}
                </button>
                <button
                  onClick={() => removeImage(image.id)}
                  aria-label={t("companions.card.removeImage")}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
                >
                  <RiCloseLine size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface TabImagesProps {
  images: CharacterImage[];
  setImages: (images: CharacterImage[]) => void;
}
