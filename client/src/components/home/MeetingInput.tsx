import { Ref } from "react";

import { Input } from "../common/Input";

type MeetingInputProps = {
  inputRef: Ref<HTMLInputElement> | null;
  placeholder: string;
};

export const MeetingInput: React.FC<MeetingInputProps> = ({
  inputRef,
  placeholder,
}) => {
  return (
    <div className="mt-2 md:mt-5">
      <Input inputRef={inputRef} placeholder={placeholder} />
    </div>
  );
};
