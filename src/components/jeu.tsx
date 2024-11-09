import React, { useState, useEffect } from 'react';
import { Container, Snackbar, Alert, Button } from '@mui/material';
import GrilleMot from './grillemots';
import { obtenirMotAleatoire, trouverMot } from '../utils/mots';
import Clavier from './clavier';

const Jeu: React.FC = () => {
  const [afficherCouleur, setAfficherCouleur] = useState<boolean>(false);
  const [motCible, setMotCible] = useState<string>('');
  const [essais, setEssais] = useState<string[]>([]);
  const [essaiCourant, setEssaiCourant] = useState<string>('');
  const [finPartie, setFinPartie] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    severity: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setMotCible(obtenirMotAleatoire());
  }, []);

  useEffect(() => {
    if (essais.length > 0) {
      verifierDernierEssai();
    }
  }, [essais]);

  /**
   * OGV : Fonction pour reset le jeu
   */
  const resetPartie = () => {
    setMotCible(obtenirMotAleatoire());
    setEssaiCourant('');
    setEssais([]);
    setMessage(null);
    setFinPartie(false);
    setAfficherCouleur(false);
  }

  const verifierDernierEssai = () => {
    const dernierEssai = essais[essais.length - 1];
    if (dernierEssai === motCible) {
      setFinPartie(true);
      setMessage({
        text: 'Félicitations ! Vous avez trouvé le mot !',
        severity: 'success',
      });
    } else if (essais.length >= 6) {
      setFinPartie(true);
      setMessage({
        text: `Dommage ! Le mot était "${motCible}".`,
        severity: 'error',
      });
    }
    /**
     * Afficher les couleurs
     */
    setAfficherCouleur(true);
  };

  const handleSoumettreEssai = () => {
    if (essaiCourant.length !== 5) {
      setMessage({
        text: 'Le mot doit comporter 5 lettres.',
        severity: 'error',
      });
      return;
    }
    if (
      /**
       * OGV : Trouver le mot dans le tableau
       */
      !trouverMot(essaiCourant.toLowerCase())
    ) {
      setMessage({
        text: "Ce mot n'est pas dans la liste.",
        severity: 'error',
      });
      return;
    }
    setEssais([...essais, essaiCourant.toUpperCase()]);
    setEssaiCourant('');
  };

  /**
   * OGV : Ajout d'un bouton pour reset la partie
   */
  return (
    <Container maxWidth="sm">
      <GrilleMot
        essais={essais}
        motCible={motCible}
        essaiCourant={essaiCourant}
        afficherCouleur={afficherCouleur}
      />
      <Clavier
        essaiCourant={essaiCourant}
        setEssaiCourant={setEssaiCourant}
        onEnter={handleSoumettreEssai}
        inactif={finPartie}
      />
      <Button variant="contained" onClick={resetPartie} disabled={finPartie ? false : true}>
        Redémarrer
      </Button>
      {message && (
        <Snackbar open autoHideDuration={6000} onClose={() => setMessage(null)}>
          <Alert
            onClose={() => setMessage(null)}
            severity={message.severity}
            sx={{ width: '100%' }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Jeu;
