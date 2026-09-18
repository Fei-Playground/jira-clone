import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@app/store/locale.store";

export const AnalyticsView = () => {
  const { t } = useTranslation();

  useEffect(() => {
    toast.info(t("analytics.notAvailableYet"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{t("analytics.comingSoon")}</div>;
};
