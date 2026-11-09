import { Card, CardContent, CardHeader, CardTitle } from "@humansignal/ui/lib/card-new/card";
import { useAppTranslation } from "@humansignal/ui";
import { PersonalInfo } from "./PersonalInfo";
import { getAccountSettingsProfileExtras } from "../extensions";
import { ProfileDirtyProvider, useDiscardProfileDrafts, useProfileFormsDirty } from "../ProfileDirtyContext";

/**
 * FIXME: This is a legacy import. We're not supposed to reach into the app from app-common;
 * `UnsavedChanges` (and its `LeaveBlocker`/`getUserConfirmation` wiring) currently lives in the app
 * layer and resolves in both LSO and LSE builds via the `apps/labelstudio` path alias.
 */
import { UnsavedChanges } from "apps/labelstudio/src/pages/CreateProject/Config/UnsavedChanges";

/**
 * Single page-level guard for the Profile section. The page stacks two independent forms
 * (PersonalInfo + the enterprise contributor profile), each reporting into ProfileDirtyProvider;
 * this reads the aggregate so one react-router blocker covers both. Warn-only: Stay / Leave.
 */
const ProfileUnsavedGuard = () => {
  const [t] = useAppTranslation();
  const anyDirty = useProfileFormsDirty();
  const discardProfileDrafts = useDiscardProfileDrafts();

  return (
    <UnsavedChanges
      hasChanges={anyDirty}
      onDiscard={discardProfileDrafts}
      modalBody={t("account.unsavedChangesBody")}
      modalDiscardText={t("account.leave")}
      modalCancelText={t("account.stay")}
    />
  );
};

export const Profile = () => {
  const [t] = useAppTranslation();
  // Enterprise features register extra profile cards (e.g. the workforce contributor profile) here.
  // Each registered component self-gates, so OSS renders them unconditionally.
  const profileExtras = getAccountSettingsProfileExtras();

  return (
    <ProfileDirtyProvider>
      <Card className="!w-full">
        <CardHeader>
          <CardTitle>{t("account.accountDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfo />
        </CardContent>
      </Card>
      {profileExtras.map((ProfileExtra, index) => (
        <ProfileExtra key={index} />
      ))}
      <ProfileUnsavedGuard />
    </ProfileDirtyProvider>
  );
};
