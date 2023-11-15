import { Ref } from "react";
import { Input } from "../common/Input";

type MeetingInputProps = {
  inputRoomIdRef: Ref<HTMLInputElement> | null;
};

export const MeetingInput: React.FC<MeetingInputProps> = ({
  inputRoomIdRef,
}) => {
  return (
    <div className="mt-5">
      <Input
        inputRef={inputRoomIdRef}
        placeholder="Insira o ID da reunião ou o link"
      />
    </div>
  );
};
