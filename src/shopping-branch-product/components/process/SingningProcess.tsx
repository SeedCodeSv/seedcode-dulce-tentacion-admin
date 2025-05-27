import { motion } from 'framer-motion';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

import { IPropsSingningProcess, steps } from './types/process.types';
import { ProcessStep } from './ProcessStep';

export function SigningProcess({
  isOpen,
  onClose,
  currentState,
  errors = [],
  titleMessage,
}: IPropsSingningProcess) {
  const currentStep = steps.findIndex((step) => step.title === currentState);

  return (
    <Modal backdrop="blur" isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Proceso de firma digital</h2>
        </ModalHeader>
        <ModalBody>
          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const error = errors.length > 0;

                return (
                  <div key={step.title} className="space-y-2">
                    <ProcessStep
                      description={step.description}
                      errorTitle={titleMessage}
                      errors={errors}
                      index={index}
                      isCurrent={index === currentStep}
                      isLast={index === steps.length - 1}
                      status={
                        error && index === currentStep
                          ? 'error'
                          : index === currentStep
                            ? 'processing'
                            : index < currentStep
                              ? 'completed'
                              : 'pending'
                      }
                      title={step.title}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </ModalBody>
        <ModalFooter>
          {errors.length > 0 && (
            <Button className="px-20" color="danger" onPress={onClose}>
              Aceptar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
