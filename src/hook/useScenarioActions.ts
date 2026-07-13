import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { scenarioApi } from "../api/scenarioApi";

export type ActionStatus = {
  status: "loading" | "success" | "error";
  message: string;
  geo: {
    lat?: number;
    lon?: number;
    alt?: number;
    x?: number;
    y?: number;
    z?: number;
  } | null;
};

export const useScenarioActions = (
  selectedSource: string | null,
  selectedEnemy: string | null,
  selectedLocation: { x: number; y: number; z: number } | null,
  selectedRadius: number,
) => {
  const [started, setStarted] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus | null>(null);

  // START
  const startMutation = useMutation({
    mutationFn: scenarioApi.start,
    onMutate: () =>
      setActionStatus({
        status: "loading",
        message: "Starting scenario...",
        geo: null,
      }),

    onSuccess: (data) => {
      if (data?.running) {
        setStarted(true);

        setActionStatus({
          status: "success",
          message: "Scenario started.",
          geo: null,
        });
      }
    },
  });

  // STOP
  const stopMutation = useMutation({
    mutationFn: scenarioApi.stop,
    onSuccess: () => {
      setStarted(false);
      setActionStatus({
        status: "success",
        message: "Scenario stopped.",
        geo: null,
      });
    },
  });

  // ATTACK
  const attackMutation = useMutation({
    mutationFn: (params: { source: string; enemy: string }) =>
      scenarioApi.attack(params.source, params.enemy),
    onMutate: () =>
      setActionStatus({
        status: "loading",
        message: "Executing tactical strike...",
        geo: null,
      }),
    onSuccess: (_, variables) =>
      setActionStatus({
        status: "success",
        message: `Attack sequence completed.`,
        geo: null,
      }),
    onError: (err: any) =>
      setActionStatus({
        status: "error",
        message: `Attack failed: ${err.message}`,
        geo: null,
      }),
  });

  // GOTO
  const gotoMutation = useMutation({
    mutationFn: (params: {
      id: string;
      location: { x: number; y: number; z: number };
      timeout: number;
      finalPointMode: number;
    }) =>
      scenarioApi.goto(
        params.id,
        params.location,
        params.timeout,
        params.finalPointMode,
      ),

    onMutate: () =>
      setActionStatus({
        status: "loading",
        message: "Sending movement command...",
        geo: null,
      }),

    onSuccess: (_, variables) =>
      setActionStatus({
        status: "success",
        message: `Object ${variables.id} is moving to coordinates.`,
        geo: variables.location,
      }),

    onError: (err: any) =>
      setActionStatus({
        status: "error",
        message: `Movement failed: ${err.message}`,
        geo: null,
      }),
  });

  // MOVE
  const moveMutation = useMutation({
    mutationFn: (params: {
      id: string;
      speed: number;
      direction: { alpha: number; beta: number; gamma: number };
      acceleration: number;
    }) => scenarioApi.move(params.id, params),

    onMutate: () =>
      setActionStatus({
        status: "loading",
        message: "Sending movement command...",
        geo: null,
      }),

    onSuccess: (_, variables) =>
      setActionStatus({
        status: "success",
        message: `Object ${variables.id} is moving.`,
        geo: null,
      }),

    onError: (err: any) =>
      setActionStatus({
        status: "error",
        message: `Movement failed: ${err.message}`,
        geo: null,
      }),
  });

  const gotoObject = (params: {
    x: number;
    y: number;
    z: number;
    timeout: number;
    finalPointMode: number;
  }) => {
    if (selectedSource && selectedLocation) {
      gotoMutation.mutate({
        id: selectedSource,
        location: selectedLocation,
        timeout: params.timeout,
        finalPointMode: params.finalPointMode,
      });
    } else {
      setActionStatus({
        status: "error",
        message:
          "Please select a source and click a target location on the map.",
        geo: null,
      });
    }
  };

  const moveObject = (params: {
    speed: number;
    direction: { alpha: number; beta: number; gamma: number };
    acceleration: number;
  }) => {
    if (selectedSource) {
      moveMutation.mutate({
        id: selectedSource,
        ...params,
      });
    } else {
      setActionStatus({
        status: "error",
        message: "Please select a source asset first.",
        geo: null,
      });
    }
  };

  const attackObject = async (attackerId: string, targetId: string, onComplete: () => void) => {
  try {
    await attackMutation.mutateAsync({ 
      source: attackerId, 
      enemy: targetId 
    });
    onComplete(); 
  } catch (e) {
    console.error("Manual attack failed", e);
  }
};

const stopObject = (params :{id: string}) => {
  if (params.id) {
    scenarioApi.stopObject(params.id);
  }
}

  return {
    started,
    starting: startMutation.isPending,
    stopping: stopMutation.isPending,
    actionStatus,
    setActionStatus,

    errors: {
      start: startMutation.error?.message,
      stop: stopMutation.error?.message,
    },

    handleScenarioStart: startMutation.mutate,
    handleScenarioStop: stopMutation.mutate,
    attackObject,
    gotoObject,
    moveObject,
    stopObject: () => selectedSource && scenarioApi.stopObject(selectedSource),
  };
};
