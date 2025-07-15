'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './createHelp.module.css';
import Step1HelpType from './components/Step1HelpType';
import Step2TimeSelection from './components/Step2TimeSelection';
import Step3HelpDetails from './components/Step3HelpDetails';
import { useCreateHelp, useCreateHelpImages } from '@/lib/hooks/useCreateHelp';
import { HelpFunnelData } from '@/lib/models/createHelpDto';

type Step = 1 | 2 | 3;

const CreateHelpPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<HelpFunnelData>({
    type: null,
    timeType: null,
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    title: '',
    content: '',
    imageFiles: [],
  });

  const { mutateAsync, isPending } = useCreateHelp();
  const { mutateAsync: uploadImageMutation } = useCreateHelpImages();

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleTimeTypeSelect = (timeType: string) => {
    setFormData((prev) => ({ ...prev, timeType }));
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleStartTimeChange = (startTime: string) => {
    setFormData((prev) => ({ ...prev, startTime }));
  };

  const handleEndTimeChange = (endTime: string) => {
    setFormData((prev) => ({ ...prev, endTime }));
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageChange = (imageFiles: File[]) => {
    setFormData((prev) => ({ ...prev, imageFiles }));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.type !== null;
      case 2:
        if (
          formData.timeType === 'specific' ||
          formData.timeType === 'tomorrow'
        ) {
          return formData.date && formData.startTime && formData.endTime;
        }
        return formData.timeType !== null;
      case 3:
        return formData.title.trim() !== '' && formData.content.trim() !== '';
      default:
        return false;
    }
  };

  const canGoPrevious = () => {
    return currentStep > 1;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;

    let createdHelpId = null;
    const uploadedImageUrls: string[] = [];

    try {
      // 1. 먼저 도움 요청 생성
      const helpData = {
        title: formData.title,
        content: formData.content,
        category: formData.type === 'heavy' ? 1 : 2, // 무거워요: 1, 어려워요: 2
        startDate:
          formData.timeType === 'now'
            ? new Date().toISOString()
            : `${formData.date}T${formData.startTime}:00`,
        endDate:
          formData.timeType === 'now'
            ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2시간 후
            : `${formData.date}T${formData.endTime}:00`,
        imageFiles: [],
      };

      // 2. 도움 요청 생성
      const helpResult = await mutateAsync(helpData);
      createdHelpId = helpResult?.id || null;

      if (!createdHelpId) {
        throw new Error('도움 요청 생성 후 ID를 받지 못했습니다.');
      }

      // 3. 이미지가 있다면 업로드
      if (formData.imageFiles.length > 0) {
        const uploadPromises = formData.imageFiles.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          const uploadResult = await uploadImageMutation({
            formData: uploadFormData,
          });
          const responseData = uploadResult as { url: string };
          if (responseData?.url) {
            return responseData.url;
          } else {
            throw new Error('이미지 업로드 후 URL을 받지 못했습니다.');
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        uploadedImageUrls.push(...uploadedUrls);

        console.log('업로드된 이미지 URLs:', uploadedImageUrls);
      }

      // const helpResult = await mutateAsync({
      //   ...helpData,
      //   imageFiles: uploadedImageUrls,
      // });
      // createdHelpId = helpResult?.id || null;

      // if (!createdHelpId) {
      //   throw new Error('도움 요청 생성 후 ID를 받지 못했습니다.');
      // }

      // // 3. 모든 작업이 성공한 경우에만 성공 처리
      alert('도움 요청이 성공적으로 생성되었습니다!');
      router.push('/junior');
    } catch (error) {
      console.error('도움 요청 생성 실패:', error);
    }
  };

  const getStepIndicatorClass = (step: number) => {
    if (step < currentStep) return styles.stepCompleted;
    if (step === currentStep) return styles.stepActive;
    return styles.stepInactive;
  };

  const getStepLineClass = (step: number) => {
    if (step < currentStep) return styles.stepLineCompleted;
    if (step === currentStep) return styles.stepLineActive;
    return styles.stepLine;
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
        return '다음 단계로!';
      case 2:
        return '다음 단계로!';
      case 3:
        return '도움 생성!';
      default:
        return '다음';
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>도움 요청</h1>
      </div>

      {/* 단계 표시기 */}
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${getStepIndicatorClass(1)}`}>1</div>
        <div className={`${styles.stepLine} ${getStepLineClass(1)}`}></div>
        <div className={`${styles.step} ${getStepIndicatorClass(2)}`}>2</div>
        <div className={`${styles.stepLine} ${getStepLineClass(2)}`}></div>
        <div className={`${styles.step} ${getStepIndicatorClass(3)}`}>3</div>
      </div>

      {/* 단계별 컨텐츠 */}
      {currentStep === 1 && (
        <Step1HelpType
          selectedType={formData.type}
          onTypeSelect={handleTypeSelect}
        />
      )}

      {currentStep === 2 && (
        <Step2TimeSelection
          selectedTimeType={formData.timeType}
          selectedDate={formData.date}
          selectedStartTime={formData.startTime}
          selectedEndTime={formData.endTime}
          onTimeTypeSelect={handleTimeTypeSelect}
          onDateChange={handleDateChange}
          onStartTimeChange={handleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
        />
      )}

      {currentStep === 3 && (
        <Step3HelpDetails
          title={formData.title}
          content={formData.content}
          imageFiles={formData.imageFiles}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onImageChange={handleImageChange}
        />
      )}

      <div className={styles.navigation}>
        <button
          className={`${styles.navButton} ${styles.navButtonSecondary}`}
          onClick={handlePrevious}
          disabled={!canGoPrevious()}
        >
          이전
        </button>

        {currentStep === 3 ? (
          <button
            className={`${styles.navButton} ${styles.navButtonPrimary} ${
              !canGoNext() || isPending ? styles.navButtonDisabled : ''
            }`}
            onClick={handleSubmit}
            disabled={!canGoNext() || isPending}
          >
            {isPending ? '생성 중...' : getButtonText()}
          </button>
        ) : (
          <button
            className={`${styles.navButton} ${styles.navButtonPrimary} ${
              !canGoNext() ? styles.navButtonDisabled : ''
            }`}
            onClick={handleNext}
            disabled={!canGoNext()}
          >
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateHelpPage;
