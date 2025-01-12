
import toast from "react-hot-toast";

export default async function copyToClipboard(label: string, textToCopy: string){
    try {
        await navigator.clipboard.writeText(textToCopy);
        toast.success(`${label} copied to clipboard`)
      } catch (error) {
        console.error("Error in handleCopy: ", error);
        toast.error(`Unable to copy ${label} to clipboard`)
      }
}