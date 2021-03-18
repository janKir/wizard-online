import React from "react";
import styled from "styled-components";
import AvatarPlaceholder from "../../../assets/avatar_placeholder.svg";
import { getAvatarUrl } from "../services/avatar.service";
import { WizardCharacter } from "../util/character-theme";

export interface PlayerAvatarProps {
  name?: string;
  character?: WizardCharacter;
  size?: number;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  character,
  size = 70,
}) => {
  return (
    <Avatar
      alt="Avatar"
      src={
        name && character ? getAvatarUrl(name, character) : AvatarPlaceholder
      }
      $size={size}
    />
  );
};

const Avatar = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size / 2}px;
  margin: 5px;
`;
