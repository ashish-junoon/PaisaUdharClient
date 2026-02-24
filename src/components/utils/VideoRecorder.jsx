import React, { useEffect, useRef, useState } from "react";
import { useUserInfoContext } from "../context/UserInfoContext";
import { useAuth } from "../context/AuthContext";
import { UploadOtherDocumentsVideo } from "../../api/Api_call";
import { toast } from "react-toastify";
import { useGetDocument } from "../context/GetDocument";
import SelectInput from "../fields/SelectInput";
import { label } from "framer-motion/client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const VideoRecorder = ({ setIsKyc }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const { getDocuments } = useGetDocument();
  const ffmpeg = new FFmpeg();

  const { userInfo, setUserInfo } = useUserInfoContext();
  const userName = userInfo?.personalInfo[0]?.full_name;

  const gender = userInfo?.personalInfo[0]?.gender == "Male" ? "करता" : "करती";
  const gender2 =
    userInfo?.personalInfo[0]?.gender == "Male" ? "समझता" : "समझती";
  const gender3 = userInfo?.personalInfo[0]?.gender == "Male" ? "करता" : "करती";
  const gender4 = userInfo?.personalInfo[0]?.gender == "Male" ? "रहा" : "रही";

  const [stream, setStream] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [language, SetLanguage] = useState(1);

  const scriptText1 = `
  Hello, this is my live verification video. I declare that I am applying for a loan from PaisaUdhar with my own consent and without any pressure from anyone.My name is ${userName} and I confirm that all the details provided by me are true and correct.
  I understand the terms and conditions of PaisaUdhar and agree to the repayment policies. This video is recorded as my live verification proof.
  Thank you.
  `;

  const scriptText2 = `नमस्ते, यह मेरा लाइव वेरिफिकेशन वीडियो है।
मैं यह घोषणा ${gender3} हूँ कि मैं अपनी पूरी इच्छा से और बिना किसी दबाव के PaisaUdhar से लोन के लिए आवेदन कर ${gender4} हूँ।
मेरा नाम ${userName} है और मैं पुष्टि ${gender} हूँ कि मेरे द्वारा दी गई सभी जानकारी सही और सत्य है।
मैं PaisaUdhar की शर्तों, नियमों और भुगतान नीतियों को ${gender2} हूँ और उनसे सहमत हूँ।
यह वीडियो लोन प्रक्रिया के लिए मेरे लाइव वेरिफिकेशन के रूप में रिकॉर्ड किया जा रहा है।
धन्यवाद।
`;

  const compressVideo = async (file, targetBitrate = 800000) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.crossOrigin = "anonymous";
      video.muted = true;

      video.onloadedmetadata = async () => {
        const stream = video.captureStream();
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp8",
          videoBitsPerSecond: targetBitrate,
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: "video/webm" });
          resolve(compressedBlob);
        };

        mediaRecorder.start();
        video.play();

        video.onended = () => {
          mediaRecorder.stop();
        };
      };

      video.onerror = reject;
    });
  };

  // Get Camera Access
  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          frameRate: { ideal: 24 },
        },
        audio: true,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStream(stream);
      })
      .catch(() => alert("Camera permission denied"));
  }, []);

  // Start Recording
  const startRecording = () => {
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8",
      videoBitsPerSecond: 400000, // 400 kbps
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // Upload WebM
  // const uploadVideo = async () => {
  //   setLoading(true);
  //   const blob = await fetch(videoURL).then((r) => r.blob());
  //   const file = new File([blob], "verification.webm", {
  //     type: "video/webm",
  //   });

  //   // Converting to MB
  //   const bytes = file?.size;
  //   const mb = bytes / (1024 * 1024);
  //   const fileSize = mb.toFixed(2);

  //   if (fileSize > 100) {
  //     toast.error("FileSize Cant be more than 100MB!");
  //   }

  //   const formData = new FormData();
  //   formData.append("user_id", userInfo?.user_id);
  //   formData.append("lead_id", userInfo?.lead_id);
  //   formData.append("document_type", "VideoKyc");
  //   formData.append("document_name", file.name);
  //   formData.append("document_extn", file.name.split(".").pop());
  //   formData.append("document_data", file); // <-- FILE here
  //   formData.append("created_by", "user");

  //   try {
  //     const response = await UploadOtherDocumentsVideo(formData);
  //     if (response.status) {
  //       toast.success(response.message || "Video Kyc Uploaded Successfully!");
  //       setIsKyc(false);
  //       setVideoURL(null);
  //       getDocuments();
  //     } else {
  //       toast.error(response.message || "Video Kyc Upload Failed!");
  //     }
  //   } catch (error) {
  //     console.error("Error in Kyc Upload : ", error);
  //   }
  //   setLoading(false);
  // };

  const uploadVideo = async () => {
    setLoading(true);

    let blob = await fetch(videoURL).then((r) => r.blob());
    let mb = blob.size / (1024 * 1024);
    // console.log("Before", mb);

    // 🔥 If more than 50MB → compress
    if (mb > 90) {
      toast.info("Compressing video...");
      blob = await compressVideo(blob, 700000); // 700kbps
      mb = blob.size / (1024 * 1024);
    }

    // console.log("After", mb);

    // 🚨 After compression still > 100MB → stop
    if (mb > 100) {
      toast.error("Video still exceeds 100MB after compression!");
      setLoading(false);
      return;
    }

    const file = new File([blob], "verification.webm", {
      type: "video/webm",
    });

    const formData = new FormData();
    formData.append("user_id", userInfo?.user_id);
    formData.append("lead_id", userInfo?.lead_id);
    formData.append("document_type", "VideoKyc");
    formData.append("document_name", file.name);
    formData.append("document_extn", "webm");
    formData.append("document_data", file);
    formData.append("created_by", "user");

    try {
      const response = await UploadOtherDocumentsVideo(formData);

      if (response.status) {
        toast.success("Video Kyc Uploaded Successfully!");
        setIsKyc(false);
        setVideoURL(null);
        getDocuments();
        setUserInfo(() => ({
          ...userInfo,
          video_kyc_verified: true,
        }))
      } else {
        toast.error("Video Kyc Upload Failed!");
      }
    } catch (error) {
      console.error("Error in Kyc Upload : ", error);
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="p-2 space-y-2 w-full">
      {!videoURL && (
        <div>
          {/* <h2 className="text-xl font-semibold">Live Video Kyc</h2> */}

          {/* Script */}
          <div className="p-2 bg-gray-100 rounded">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Please read this:</p>
              <div className="col-span-2">
                <SelectInput
                  name="Select Language"
                  placeholder="Select Language"
                  onChange={(e) => SetLanguage(e.target.value)}
                  options={[
                    { label: "English", value: 1 },
                    { label: "Hindi", value: 2 },
                  ]}
                  style="p-1 rounded-md text-sm border border-gray-200 outline-none cursor-pointer"
                />
              </div>
            </div>
            <p className="text-amber-500 text-sm font-semibold">
              {language == 1 ? scriptText1 : scriptText2}
            </p>
          </div>

          {/* Live Camera */}
          <video
            ref={videoRef}
            autoPlay
            muted
            className="max-md:w-full w-[80%] lg:h-[300px] mt-2 m-auto rounded border transform -scale-x-100"
          />

          {/* Controls */}
          <div className="space-x-3 text-center mt-1">
            {!recording && (
              <button
                onClick={startRecording}
                className="px-2 py-1 bg-primary text-white rounded w-full"
              >
                Start
              </button>
            )}

            {recording && (
              <button
                onClick={stopRecording}
                className="px-2 py-1 bg-orange-500 text-white rounded w-full animate-pulse"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {videoURL && (
        <div className="">
          <h3 className="font-semibold">Preview</h3>
          <video
            src={videoURL}
            controls
            className="w-full m-auto rounded border"
          />

          {videoURL && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  (setIsKyc(false),
                    setUserInfo(() => ({
                      ...userInfo,
                      video_kyc_verified: false,
                    })));
                }}
                className="px-2 py-1 bg-secondary text-white rounded mt-1 w-full"
              >
                Cancle
              </button>

              <button
                onClick={uploadVideo}
                disabled={loading}
                className="px-2 py-1 bg-primary text-white rounded mt-1 w-full"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
