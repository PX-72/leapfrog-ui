import { useState, useEffect } from 'react';
import { DefaultButton, DefaultDangerButton, SmallButton, DangerSmallButton } from './styles';
import styled from 'styled-components';

const ConfirmButtonSetContainer = styled.div`
  display: flex;
  gap: 0.3rem;
`;

type ConfirmableProps = {
  isInConfirmMode: boolean;
};

const makeMainButton = (BaseComponent: React.ElementType) => styled(BaseComponent)<ConfirmableProps>`
  display: ${({ isInConfirmMode }) => (isInConfirmMode ? 'none' : 'block')};
`;

const makeActionButton = (BaseComponent: React.ElementType) => styled(BaseComponent)<ConfirmableProps>`
  display: ${({ isInConfirmMode }) => (isInConfirmMode ? 'block' : 'none')};
`;

const makeCancelButton = (BaseComponent: React.ElementType) => styled(BaseComponent)<ConfirmableProps>`
  display: ${({ isInConfirmMode }) => (isInConfirmMode ? 'block' : 'none')};
`;

const MainButton = makeMainButton(DefaultButton);
const ActionButton = makeActionButton(DefaultDangerButton);
const CancelButton = makeCancelButton(DefaultButton);

const SmallMainButton = makeMainButton(SmallButton);
const SmallActionButton = makeActionButton(DangerSmallButton);
const SmallCancelButton = makeCancelButton(SmallButton);

type InternalConfirmButtonProps = {
  onConfirm: () => void;
  label: string;
  mustReset: boolean;
  MainBtn: typeof MainButton;
  ActionBtn: typeof ActionButton;
  CancelBtn: typeof CancelButton;
};

const InternalConfirmButton = ({
  onConfirm,
  label,
  MainBtn,
  ActionBtn,
  CancelBtn,
  mustReset
}: InternalConfirmButtonProps) => {
  const [isInConfirmMode, setConfirmMode] = useState(false);

  useEffect(() => {
    if (mustReset) setConfirmMode(false);
  }, [mustReset]);

  return (
    <>
      <MainBtn onClick={() => setConfirmMode(true)} isInConfirmMode={isInConfirmMode}>
        {label}
      </MainBtn>
      <ConfirmButtonSetContainer>
        <CancelBtn onClick={() => setConfirmMode(false)} isInConfirmMode={isInConfirmMode}>
          Cancel
        </CancelBtn>
        <ActionBtn
          isInConfirmMode={isInConfirmMode}
          onClick={() => {
            onConfirm();
            setConfirmMode(false);
          }}>
          {label}
        </ActionBtn>
      </ConfirmButtonSetContainer>
    </>
  );
};

type ConfirmButtonProps = Pick<InternalConfirmButtonProps, 'onConfirm' | 'label' | 'mustReset'>;

export const ConfirmButton = ({ onConfirm, label, mustReset }: ConfirmButtonProps) => (
  <InternalConfirmButton
    onConfirm={onConfirm}
    label={label}
    mustReset={mustReset}
    MainBtn={MainButton}
    ActionBtn={ActionButton}
    CancelBtn={CancelButton}
  />
);

export const SmallConfirmButton = ({ onConfirm, label, mustReset }: ConfirmButtonProps) => (
  <InternalConfirmButton
    onConfirm={onConfirm}
    label={label}
    mustReset={mustReset}
    MainBtn={SmallMainButton}
    ActionBtn={SmallActionButton}
    CancelBtn={SmallCancelButton}
  />
);
