import { StorageProvider } from '@arcana/storage/dist/standalone/storage.umd';
import { APP_ID } from '../config';

let storageInstance;

function useArcanaStorage() {
  const initializeStorage = (privateKey, email) => {
    console.log(StorageProvider);
    storageInstance = new StorageProvider({ APP_ID, privateKey, email });
    console.log(storageInstance);
  }

  // Only for admin
  const upload = async (file) => {
    const Uploader = await storageInstance.getUploader();
    console.log(Uploader, file);
    const reader = new window.FileReader()
    let myBuffer;
    
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      myBuffer = await Buffer(reader.result);
      console.log(myBuffer);
      const res = await Uploader.upload(myBuffer);
      return res;
    }
  }

  const download = async (file) => {
    let did = file.fileHash;
    did = did.substring(0, 2) !== "0x" ? "0x" + did : did;

    const Downloader = await storageInstance.getDownloader();
    const res = await Downloader.download(did);
    return res;
  }

  // Only for admin: Members gets access to eBooks
  const share = async (dids, publicKeys) => {
    const Access = await storageInstance.getAccess();

    const validity = 31536000; // 1 year

    const res = await Access.share([dids], [publicKeys], [validity]);
    return res;
  }

  // Only for admin: Member access removed for eBooks
  const revoke = async (did, address) => {
    const Access = await storageInstance.getAccess();

    const res = await Access.revoke(did, address);
    return res;
  }

  return {
    initializeStorage,
    upload,
    download,
    share,
    revoke
  };
}

export default useArcanaStorage;
