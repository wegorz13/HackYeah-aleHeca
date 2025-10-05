import { TextArea } from "@/components/base/textarea/textarea";

type ThirdStepProps = {
    additionalInfo: string;
    setAdditionalInfo: (additionalInfo: string) => void;

};


export const ThirdStep = ({additionalInfo, setAdditionalInfo}: ThirdStepProps) => {

    return (
        <>
      <div className="flex w-full flex-col gap-4">
  <h3 className="text-sm font-medium text-gray-900">Additional Info</h3>
        <div className="flex flex-col gap-1">

          <TextArea value = {additionalInfo} onChange={setAdditionalInfo}  isRequired placeholder="Enter additional info..."  hint="Max 256 characters" rows={5} />
        </div>
      </div>
    </>
    );
}
