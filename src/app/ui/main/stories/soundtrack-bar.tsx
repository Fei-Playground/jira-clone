import { RiPlayFill, RiPauseFill, RiVolumeUpLine } from "react-icons/ri";
import { MusicMood, MUSIC_MOOD_EMOJI } from "@domain/music";
import { useTranslation } from "@app/store/locale.store";
import { Tooltip } from "@app/components/tooltip";
import { AmbientSoundtrackControls } from "./use-ambient-soundtrack";

const MOOD_LABEL_KEY: Record<MusicMood, string> = {
  calm: "stories.music.moodCalm",
  tense: "stories.music.moodTense",
  melancholy: "stories.music.moodMelancholy",
  mysterious: "stories.music.moodMysterious",
  triumphant: "stories.music.moodTriumphant",
};

// A slim "now playing" bar for the scene's live, generated ambient
// soundtrack. The mood (and therefore what's audibly playing) is a real
// function of the scene's world + the current environment — see
// deriveSceneMood — so this bar's label changes exactly when the
// soundtrack itself changes underneath it.
export const SoundtrackBar = ({
  mood,
  controls,
}: {
  mood: MusicMood;
  controls: AmbientSoundtrackControls;
}): JSX.Element => {
  const { t } = useTranslation();
  const { isPlaying, isSupported, volume, setVolume, toggle } = controls;

  return (
    <div className="mt-3 flex flex-col gap-1.5 rounded-md border border-border bg-elevation-surface-raised px-2 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-base">{MUSIC_MOOD_EMOJI[mood]}</span>
        <span className="flex-1 text-font-subtlest">
          {t(MOOD_LABEL_KEY[mood] as never)}
        </span>
        {isSupported ? (
          <Tooltip
            title={
              isPlaying ? t("stories.music.pause") : t("stories.music.play")
            }
          >
            <button
              onClick={toggle}
              aria-label={
                isPlaying ? t("stories.music.pause") : t("stories.music.play")
              }
              className="flex h-6 w-6 items-center justify-center rounded-full text-icon hover:bg-background-neutral"
            >
              {isPlaying ? <RiPauseFill size={16} /> : <RiPlayFill size={16} />}
            </button>
          </Tooltip>
        ) : (
          <span className="text-2xs text-font-subtlest">
            {t("stories.music.unsupported")}
          </span>
        )}
      </div>
      {isSupported && (
        <div className="flex items-center gap-2">
          <RiVolumeUpLine size={14} className="text-icon" />
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            aria-label={t("stories.music.volume")}
            className="h-1 flex-1 accent-icon-brand"
          />
        </div>
      )}
      <p className="text-2xs text-font-subtlest">
        {t("stories.music.disclosure")}
      </p>
    </div>
  );
};
