import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import styled from "styled-components";
import merge from "lodash/merge";
import { Form } from "../components/Form";
import {
  initialProfilePreferences,
  ProfileStore,
} from "../services/profile.service";
import { characters, WizardCharacter } from "../util/character-theme";
import { PlayerAvatar } from "../player/PlayerAvatar";

export interface EditProfileProps {
  defaultProfile?: ProfileStore;
  onSubmit(profile: ProfileStore): void;
  submitLabel: string;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  defaultProfile,
  onSubmit,
  submitLabel,
}) => {
  const [profile, setProfile] = useState<ProfileStore>(
    merge(
      {
        name: "",
        character: null,
        preferences: initialProfilePreferences,
      },
      defaultProfile
    )
  );

  const { handOrder } = profile.preferences;

  const updateProfile = useCallback((changes: Partial<ProfileStore>) => {
    setProfile((previousProfile) => merge({}, previousProfile, changes));
  }, []);
  return (
    <FormContainer>
      <Form onSubmit={() => onSubmit(profile)}>
        <FormField>
          <TextField
            label="Name"
            required
            fullWidth
            value={profile.name}
            onChange={(event) => updateProfile({ name: event.target.value })}
          />
        </FormField>

        <FormField>
          <FormControl required>
            <FormLabel>Charakter</FormLabel>
            <RadioGroup
              value={profile.character}
              onChange={(event) =>
                updateProfile({
                  character: event.target.value as WizardCharacter,
                })
              }
            >
              {Object.keys(characters).map((characterKey) => {
                const character = characters[characterKey as WizardCharacter];
                return (
                  <FormControlLabel
                    value={characterKey}
                    control={<ColoredRadio $color={character.color.medium} />}
                    label={character.label}
                    key={characterKey}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </FormField>

        <PlayerAvatar name={profile.name} character={profile.character} />

        <h3>Einstellungen</h3>
        <FormField>
          <FormControlLabel
            label="Ton wenn am Zug"
            control={
              <Checkbox
                checked={profile.preferences.turnAlert ?? false}
                onChange={(event) =>
                  updateProfile({
                    preferences: { handOrder, turnAlert: event.target.checked },
                  })
                }
              />
            }
          />
        </FormField>
        <FormField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!profile}
          >
            {submitLabel}
          </Button>
        </FormField>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 450px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const FormField = styled.div`
  display: flex;
  margin: 0 10px;
  padding: 20px 0;
  float: "left";
`;

const ColoredRadio = styled(Radio)<{ $color: string }>`
  &.MuiRadio-root {
    color: ${({ $color }) => $color};
  }
`;
