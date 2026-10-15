import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Save, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useUser, useUpdateMe } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

import { useUpload } from "@/hooks/useUpload";

const schema = z.object({
  firstName: z.string().min(1, "Required").max(60),
  lastName: z.string().min(1, "Required").max(60),
  bio: z.string().max(500).optional(),
  headline: z.string().max(120).optional(),
});

export default function Profile() {
  const { isSignedIn } = useAuth();
  const { data: user, isLoading } = useUser();
  const updateMe = useUpdateMe();
  const { run: uploadAvatar, isUploading } = useUpload();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      bio: user.bio || "",
      headline: user.headline || "",
    });
  }, [user, reset]);

  const handleAvatar = async (file) => {
    try {
      const res = await uploadAvatar("avatar", file);
      setAvatarPreview(res.url);
      await updateMe.mutateAsync({ imageUrl: res.url });
    } catch {
      // error already handled in hook
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateMe.mutateAsync(data);
    } catch {
      // handled
    }
  };

  if (!isSignedIn) return null;
  if (isLoading) {
    return (
      <section className="container py-10 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-24 w-full" />
      </section>
    );
  }

  return (
    <section className="container py-10 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold font-display mb-6">Your profile</h1>

        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-brand-100 dark:bg-brand-500/10 grid place-items-center overflow-hidden">
                {avatarPreview || user?.imageUrl ? (
                  <img
                    src={avatarPreview || user?.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-brand-700 dark:text-brand-300">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white shadow-soft cursor-pointer">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatar(f);
                  }}
                />
              </label>
            </div>
            <div>
              <p className="font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-slate-500">
                Role: <span className="capitalize">{user?.role}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Last name"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>
            <Input
              label="Headline"
              error={errors.headline?.message}
              {...register("headline")}
            />
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Bio
              </label>
              <textarea
                rows={4}
                className="input resize-y"
                {...register("bio")}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="submit"
                disabled={!isDirty || updateMe.isPending}
              >
                {updateMe.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}