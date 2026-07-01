// 타이핑 애니메이션 훅 — ROLES 배열을 순환하며 타이핑/지우기를 반복
import { useEffect, useState } from 'react';

interface UseTypewriterOptions {
  roles: string[];
  // @param typingSpeed: 글자당 타이핑 속도 (ms)
  typingSpeed?: number;
  // @param deletingSpeed: 글자당 지우기 속도 (ms)
  deletingSpeed?: number;
  // @param pauseDuration: 완성 후 대기 시간 (ms)
  pauseDuration?: number;
}

// @usage Hero.tsx — 타이핑 애니메이션 텍스트 표시
const useTypewriter = ({
  roles,
  typingSpeed = 80,
  deletingSpeed = 35,
  pauseDuration = 2200,
}: UseTypewriterOptions) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];

    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), pauseDuration);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), deletingSpeed);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
  }, [displayed, deleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseDuration]);

  return displayed;
};

export default useTypewriter;
